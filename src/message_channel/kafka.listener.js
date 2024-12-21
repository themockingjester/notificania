const { SUPPORTED_MESSAGE_CHANNELS } = require("../constants/messangingChannel.constant")
const { exportedDIContainer } = require("../exportedDiContainer")
const { processMessage } = require("./message_utility")

class KafkaMessageListener {
    async initialize() {
        await exportedDIContainer.messageChannels.kafka.consumer.consumer.consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {

                processMessage({
                    message: message,
                    messageForwadedBy: SUPPORTED_MESSAGE_CHANNELS.APACHE_KAFKA,
                    additionalData: {
                        topic, partition, heartbeat, pause
                    }
                })
            },
        })
    }
}

module.exports = new KafkaMessageListener()