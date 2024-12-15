const config = require("../../config.json")
const KafkaListener = require("./kafka.listener")
const setupMessageListerners = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.ENABLED) {
                await KafkaListener.initialize()
            }
            resolve()
        } catch (error) {
            reject(error)
        }

    })

}

module.exports = {
    setupMessageListerners
}