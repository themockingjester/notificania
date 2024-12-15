const { exportedDIContainer } = require("../exportedDiContainer")

class KafkaMessageListener {
    async initialize() {
        await exportedDIContainer.messageChannels.kafka.consumer.consumer.consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {

                //TODO: Continue from here
                // console.log({
                //     key: message.key?.toString(),
                //     value: message.value.toString(),
                //     headers: message.headers
                // }, 456666)
            },
        })
    }
}

module.exports = new KafkaMessageListener()