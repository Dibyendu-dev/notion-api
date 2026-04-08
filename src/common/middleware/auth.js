import { authenticateRequest } from "@clerk/express";
import { UnauthorizedError } from "../errors/base.error.js";

export const auth = async (req, res, next) => {
  try {
    const { userId } = await authenticateRequest(req);
    
    if (!userId) {
      return next(new UnauthorizedError("Not authenticated"));
    }
    
    req.user = { id: userId };
    next();
  } catch (error) {
    next(new UnauthorizedError("Authentication failed"));
  }
};
