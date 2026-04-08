import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./infrastructure/db/mongo.connection.js";
import { redisClient } from "./infrastructure/cache/redis.connection.js";
import { logger } from "./infrastructure/logger/logger.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    logger.info("Database connected successfully");

    redisClient.ping().then(() => {
      logger.info("Redis connected successfully");
    }).catch(() => {
      logger.error("Redis connection failed");
    });

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
};

start();
