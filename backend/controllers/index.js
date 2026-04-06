import bcrypt from "bcryptjs";
import { User } from "../models/index.js";

/** @param {import('express').Router} r */
export const setupUserController = (r) => {
  r.post("/signup", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).send({ message: "Username and password required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword });

      // Automatically login after signup
      req.session.user = { id: user.id, username: user.username };
      res.status(201).send(req.session.user);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).send({ message: "Username already exists" });
      }
      next(error);
    }
  });

  r.post("/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send({ message: "Invalid username or password" });
      }

      req.session.user = { id: user.id, username: user.username };
      res.status(200).send(req.session.user);
    } catch (error) {
      next(error);
    }
  });

  r.get("/me", (req, res) => {
    if (req.session.user) {
      res.status(200).send(req.session.user);
    } else {
      res.status(401).send({ message: "Not authenticated" });
    }
  });

  r.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).send({ message: "Logout failed" });
      res.clearCookie("sessionId");
      res.status(204).send();
    });
  });

  r.get("/about", async (req, res, next) => {
    if (!req.session.user) return res.status(401).send({ message: "Not authenticated" });
    try {
      const user = await User.findOne({ where: { id: req.session.user.id }, attributes: ["bio"] });
      res.status(200).send({ bio: user?.bio || "" });
    } catch (error) {
      next(error);
    }
  });

  r.patch("/about", async (req, res, next) => {
    if (!req.session.user) return res.status(401).send({ message: "Not authenticated" });
    try {
      const { bio } = req.body;
      await User.update({ bio }, { where: { id: req.session.user.id } });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  r.get("/users", function getAll(req, res, next) {
    User.findAll({
      order: ["id"],
      attributes: { exclude: ["password"] }, // Don't send passwords
    })
      .then((instance) => res.status(200).send(instance))
      .catch(next);
  });

  r.get("/users/:id", function getOne(req, res, next) {
    User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: { exclude: ["password"] },
    })
      .then((instance) => res.status(200).send(instance))
      .catch(next);
  });

  r.patch("/users/:id", function patch(req, res, next) {
    const { username } = req.body;
    if (typeof username === "string") {
      User.update(
        { username },
        {
          where: {
            id: req.params.id,
          },
        }
      )
        .then(() => {
          res.status(204).send();
        })
        .catch(next);
    } else {
      next();
    }
  });

  r.get("/csrf", function setCsrfCookie(req, res) {
    res.cookie("XSRF-TOKEN", req.csrfToken(), {
      httpOnly: false, // Must be accessible for Axios to read it
      path: "/",
      sameSite: "lax",
    });
    res.status(204).send();
  });
};

/**
 * @typedef {import('@types/express-serve-static-core').RequestHandler<
 *   import('@types/express-serve-static-core').RouteParameters<
 *     "users/:id"
 *   >, any, any, ParsedQs, Record<string, any>
 * >} userHandler
 */
