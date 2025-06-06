const { HTTP_CODES } = require("../../../constants/httpCodes.constant");
const { resultObject } = require("../../common.utils");
const config = require("../../../../config.json");
const { kafkaConnection } = require("../connection");
const AbstractKafkaProducer = require("./abstractProducer");
const { logger } = require("../../../di-container");

// creating producer from Kafka connection
const producer = kafkaConnection.producer();

class KafkaProducer extends AbstractKafkaProducer {
  /**
   * finalizing producer connection from kafka connection
   */
  async initialize() {
    await producer.connect();
    logger.info("Successfully initialized kafka producer 🚀");
  }

  /**
   * Disconnect from producer connection
   */
  async disconnect() {
    await producer.disconnect();
    logger.info("Successfully disconnected from kafka producer");
  }

  /**
   *
   * @param {string} message
   */
  async sendMessage(message) {
    await producer.send({
      topic: config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.TOPIC,
      messages: [
        {
          value: message,
          key: JSON.parse(message).key,
        },
      ],
    });

    return resultObject(
      true,
      `Successfully sent message to kafka`,
      {},
      HTTP_CODES.OK
    );
  }
}

// Exporting single created object only so multiple objects cann't be created
module.exports = new KafkaProducer();
