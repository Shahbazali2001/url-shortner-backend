import { verifyToken } from "../utils/token.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

export function authenticationMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const parts = authHeader.split(" ");
    if (parts[0] !== "Bearer" || !parts[1]) {
      return res.status(401).json({ error: "Invalid authorization format" });
    }
    const token = parts[1];
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
