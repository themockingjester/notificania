const { SERVER_SETUP_CONSTANTS } = require("../../constants/serverSetup.constant");
const { config } = require("../../di-container");
const RedisCachingStrategy = require("./redisCachingStrategy");

async function getCachingStrategy() {
    if (config.SERVER.CACHING.REDIS.ENABLED) {
        return new RedisCachingStrategy()
    } else {
        throw new Error(SERVER_SETUP_CONSTANTS.ERROR_MESSAGES.UNABLE_TO_FIND_CORRECT_CACHING_STRATEGY)
    }
}

module.exports = {
    getCachingStrategy
}