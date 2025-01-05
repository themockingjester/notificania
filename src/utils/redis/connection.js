var Redis = require('redis');
const config = require('../../../config.json')
class RedisConnection {

    redisClient
    async initialize() {

        if (config.SERVER.CACHING.REDIS.ENABLED) {
            if (config.SERVER.CACHING.REDIS.MODE == "CLUSTER") {

                this.redisClient = await Redis.createCluster({
                    rootNodes: [...config.SERVER.CACHING.REDIS.CLUSTER_SERVERS]
                });
                await this.redisClient.connect()
            } else {
                this.redisClient = await Redis.createClient({
                    socket: {
                        ...config.SERVER.CACHING.REDIS.STANDALONE_SERVER
                    }
                });
                await this.redisClient.connect()
                // await this.redisClient.select(0)
            }

            console.log("Redis connection established 🚀")
        } else {
            console.log(`Redis is not enabled ❌`)
        }
    }
    disconnect() {
        // Will implement redis connection disconnection logic
    }
}

module.exports = new RedisConnection()
