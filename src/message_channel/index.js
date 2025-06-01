const config = require("../../config.json");
const KafkaListener = require("./kafka.listener");
const setupMessageListerners = async () => {
  try {
    if (config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.ENABLED) {
      await KafkaListener.initialize();
    }
  } catch (error) {
    reject(error);
  }
};

module.exports = {
  setupMessageListerners,
};
