
const config = require("../../../../config.json");
const { logger } = require("../../../di-container");
const { kafkaConnection } = require("../connection")
const AbstractKafkaConsumer = require("./abstractConsumer")
const { PartitionAssigners } = require('kafkajs');

// creating consumer from Kafka connection
const consumer = kafkaConnection.consumer({
    groupId: config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.CONSUMER_GROUP, partitionAssigners: [PartitionAssigners.roundRobin]
})


class KafkaConsumer extends AbstractKafkaConsumer {
    consumer
    /**
     * finalizing consumer connection from kafka connection
     */
    async initialize() {

        await consumer.connect()
        await consumer.subscribe({ topics: [config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.TOPIC] })
        this.consumer = consumer
        logger.info('Successfully initialized kafka consumer 🚀')
    }

    /**
     * Disconnect from consumer connection
     */
    async disconnect() {
        await consumer.disconnect()
    }

}

// Exporting single created object only so multiple objects cann't be created
module.exports = new KafkaConsumer()