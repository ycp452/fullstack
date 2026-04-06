import axios from "axios";
import { makeAuth } from "./auth";
import { makeUser } from "./user";

const services = {};

const instance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

let csrfToken = null;

// Fetch and cache the CSRF token
async function fetchCsrfToken() {
  if (!csrfToken) {
    const resp = await instance.get("/csrf");
    csrfToken = resp.data.csrfToken;
  }
  return csrfToken;
}

// Attach CSRF token to all mutating requests
instance.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const token = await fetchCsrfToken();
    config.headers["x-csrf-token"] = token;
  }
  return config;
});

// If a 403 is returned, invalidate the cached token and retry once
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (error.response?.status === 403 && !config._csrfRetry) {
      config._csrfRetry = true;
      csrfToken = null;
      const token = await fetchCsrfToken();
      config.headers["x-csrf-token"] = token;
      return instance(config);
    }
    return Promise.reject(error);
  }
);

services.auth = makeAuth(instance);
services.user = makeUser(instance);

export default services;
