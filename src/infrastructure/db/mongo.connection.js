import mongoose from "mongoose";
import { logger } from "../logger/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection failed", { error: error.message });
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  logger.info("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB error", { error: err.message });
});
