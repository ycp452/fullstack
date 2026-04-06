/** @param {import("axios").AxiosInstance} instance */
export const makeAuth = (instance) => ({
  getCsrf() {
    return instance.get("/csrf");
  },
  /**
   * @param {{
   *   username: string,
   *   password: string,
   * }}
   */
  login({ username, password }) {
    return instance.post("/login", { username, password });
  },
  /**
   * @param {{
   *   username: string,
   *   password: string,
   * }}
   */
  signup({ username, password }) {
    return instance.post("/signup", { username, password });
  },
  me() {
    return instance.get("/me");
  },
  logout() {
    return instance.post("/logout");
  },
  getAbout() {
    return instance.get("/about");
  },
  saveAbout(bio) {
    return instance.patch("/about", { bio });
  },
});
