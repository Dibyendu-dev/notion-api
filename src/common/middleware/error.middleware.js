import { logger } from "../../infrastructure/logger/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error("Error occurred", {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
};
