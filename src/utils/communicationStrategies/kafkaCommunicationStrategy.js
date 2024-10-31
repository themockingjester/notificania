const config = require("../../../config.json");
const { HTTP_CODES } = require("../../constants/httpCodes.constant");
const { resultObject } = require("../common.utils");
const CommunicationStrategy = require("./communicationStrategy");
const kafkaProducerObj = require("../kafka/producer/producer")

class KafkaCommunicationStrategy extends CommunicationStrategy {

    /** KafkaProducer */
    producer

    constructor() {
        if (config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.ENABLED) {
            this.isEnabled = true;

            // Creating and intializing kafka producer connection
            this.producer = kafkaProducerObj
            this.producer.initialize()

        }
    }

    /**
     * 
     * @param {object} data 
     * return : object
     */
    async sendMessage(data) {
        if (!this.isEnabled) {
            return resultObject(false, `This message channel is not enabled`, {}, HTTP_CODES.NOT_ALLOWED)
        }
        return await this.producer.sendMessage(JSON.stringify(data));
    }

}

module.exports = KafkaCommunicationStrategy;