const config = require("../../../config.json");
const { HTTP_CODES } = require("../../constants/httpCodes.constant");
const { resultObject } = require("../common.utils");
const CommunicationStrategy = require("./communicationStrategy");
const kafkaProducerObj = require("../kafka/producer/producer")
const kafkaConsumerObj = require("../kafka/consumer/consumer")
class KafkaCommunicationStrategy extends CommunicationStrategy {

    /** KafkaProducer */
    producer

    /** KafkaConsumer */
    consumer
    constructor() {
        super()
        if (config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.ENABLED) {
            this.isEnabled = true;
        }
    }

    async initialize() {
        // Creating and intializing kafka producer connection
        this.producer = kafkaProducerObj
        await this.producer.initialize()

        // Creating and intializing kafka consumer connection
        this.consumer = kafkaConsumerObj
        await this.consumer.initialize()
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