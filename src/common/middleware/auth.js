import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors/base.error.js";

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return next(new UnauthorizedError("Invalid token"));
  }
};
