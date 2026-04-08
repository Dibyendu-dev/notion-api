import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { logger } from "../logger/logger.js";

let mongoServer;

export const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "test" || process.env.USE_MEMORY_DB === "true") {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      logger.info("MongoDB Memory Server connected");
    } else {
      await mongoose.connect(process.env.MONGO_URI);
      logger.info("MongoDB connected");
    }
  } catch (error) {
    logger.error("MongoDB connection failed", { error: error.message });
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

mongoose.connection.on("disconnected", () => {
  logger.info("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB error", { error: err.message });
});
