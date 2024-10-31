const { Kafka } = require('kafkajs')
const config = require("../../../config.json")
const kafkaConnection = new Kafka({
    clientId: config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.CLIENT_ID,
    brokers: [...config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.BROKERS],
})

module.exports = { kafkaConnection }