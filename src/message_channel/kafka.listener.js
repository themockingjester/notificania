const { CACHING_CONSTANTS } = require("../constants/caching.constant")
const { SUPPORTED_MESSAGE_CHANNELS } = require("../constants/messangingChannel.constant")
const { exportedDIContainer } = require("../exportedDiContainer")
const { processMessage } = require("./message_utility")

class KafkaMessageListener {
    async initialize() {
        await exportedDIContainer.messageChannels.kafka.consumer.consumer.consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                let { key: messageKey } = message
                messageKey = messageKey.toString()
                try {
                    await processMessage({
                        message: message,
                        messageForwadedBy: SUPPORTED_MESSAGE_CHANNELS.APACHE_KAFKA,
                        additionalData: {
                            topic, partition, heartbeat, pause
                        }
                    })
                    await exportedDIContainer.caching.strategy.setKey(
                        {
                            cacheName: CACHING_CONSTANTS.IN_APP_CACHES.CACHE_NAMES.SUCCESSFULLY_PROCESSED_MESSAGE
                            , key: messageKey, dataToCache:
                            {
                                status: "PROCESSED"
                            }, expiryInSeconds: CACHING_CONSTANTS.IN_APP_CACHES.DEFAULT_CACHE_EXPIRY.SUCCESSFULLY_PROCESSED_MESSAGE_EXPIRY
                        }

                    )
                } catch (error) {
                    //TODO: handle error later
                }
            },
        })
    }
}

module.exports = new KafkaMessageListener()