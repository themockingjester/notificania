class AbstractKafkaProducer {
    /**
     * Initiaizes connection to kafka producer
     */
    initialize() { }

    /**
     * Disconnect from kafka producer
     */
    disconnect() { }

    /**
     * sends message via kafka producer
     * @param {string} message 
     */
    async sendMessage(message) { }
}

module.exports = AbstractKafkaProducer;