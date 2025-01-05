const { config } = require("../di-container")

const basePrefix = config.APP_DETAILS.NAME
module.exports = {
    CACHING_CONSTANTS: {
        IN_APP_CACHES: {
            CACHE_NAMES: {
                SUCCESSFULLY_PROCESSED_MESSAGE: `${basePrefix}:SUCCESSFULLY_PROCESSED_MESSAGE`,

            },
            DEFAULT_CACHE_EXPIRY: {
                SUCCESSFULLY_PROCESSED_MESSAGE_EXPIRY: 24 * 60 * 60
            }
        },

    }
}