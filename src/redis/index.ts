import { createClient } from "redis";
import logger from "../config/logger";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
    url: REDIS_URL,
});

redisClient.on("connect", () => logger.info("Redis client connected"));
redisClient.on("ready", () => logger.info("Redis client is ready"));
redisClient.on("error", (err) => logger.error("Redis client error: ", err));
redisClient.on("end", () => logger.info("Redis client disconnected"));

(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error("Failed to connect Redis: ", error);
    }
})();

export default redisClient;



