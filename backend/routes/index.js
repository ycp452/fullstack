import express from "express";
import csrf from "csurf";
import { setupUserController } from "../controllers/index.js";

const csrfProtection = csrf();

export const apiRouter = express.Router();
apiRouter.use(csrfProtection);

// Endpoint for the frontend to fetch a CSRF token
apiRouter.get("/csrf", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

setupUserController(apiRouter);
