const { config } = require("../../di-container");
const CachingStrategy = require("./cachingStrategy");
const redisHelperFunctions = require("./../redis/helperFunctions");

class RedisCachingStrategy extends CachingStrategy {
    strategyType = config.SERVER.CACHING.SUPPORTED_CACHING.REDIS
    async getKey(data) {
        let { cacheName, key } = data
        let cachedData = await redisHelperFunctions.getKey(cacheName, key)
        return cachedData
    }
    async setKey(data) {
        let { cacheName, key, dataToCache, expiryInSeconds } = data
        let cachedData = await redisHelperFunctions.setKey(cacheName, key, dataToCache, expiryInSeconds)
        return cachedData
    }
}
module.exports = RedisCachingStrategy;
