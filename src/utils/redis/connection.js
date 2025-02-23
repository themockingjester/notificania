var Redis = require("redis");
const config = require("../../../config.json");
const { logger } = require("../../di-container");
class RedisConnection {
  redisClient;
  async initialize() {
    if (config.SERVER.CACHING.REDIS.ENABLED) {
      if (config.SERVER.CACHING.REDIS.MODE == "CLUSTER") {
        this.redisClient = await Redis.createCluster({
          rootNodes: [...config.SERVER.CACHING.REDIS.CLUSTER_SERVERS],
        });
        await this.redisClient.connect();
      } else {
        this.redisClient = await Redis.createClient({
          socket: {
            ...config.SERVER.CACHING.REDIS.STANDALONE_SERVER,
          },
        });
        await this.redisClient.connect();
        // await this.redisClient.select(0)
      }
      logger.info("Redis connection established 🚀");
    } else {
      logger.error(`Redis is not enabled ❌`);
    }
  }
  async disconnect() {
    if (this.redisClient) {
      await this.redisClient
        .quit()
        .then(() => {
          logger.info("Redis connection closed ✅");
        })
        .catch((err) => {
          logger.error(`Error closing Redis connection: ${err}`);
        });
    } else {
      logger.info("No active Redis connection to close.");
    }
  }
}

module.exports = new RedisConnection();
