const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../constants/apacheCassandra.constant");
const { APPLICATION_CONSTANTS } = require("../constants/application.constant");
const {
  SUPPORTED_MESSAGE_CHANNELS,
  MESSAGE_LISTENER_INTERNAL_RESPONSES,
} = require("../constants/messangingChannel.constant");
const { logger } = require("../di-container");
const {
  getMessageProcessor,
  processMessageByProcessor,
} = require("../message_processor/message_processor_factory");
const dataWareHouseHelperFunctions = require("../utils/dataWareHouseUtils/dataWareHouseHelperFunctions");
const { messageEnhancer } = require("./messageEnhancement");

const processMessage = async (message) => {
  const messageKey = message.message.key.toString();
  // Refactoring message
  const reFactoredMessage = messageRefactorAdapter(message);

  // Enhacing message
  await messageEnhancer(reFactoredMessage);
  let enhancedMessage = { ...reFactoredMessage };
  logger.info(`Message enhancement done for message: ${messageKey}`, {
    enhancedMessage: enhancedMessage,
  });
  await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs({
    message_id: messageKey,
    input_data: JSON.stringify({
      message,
    }),
    output_data: JSON.stringify({
      response: "Message Enhancement Done",
      enhancedMessage,
    }),
    process_status:
      APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
        .PROCESS_STATUS.IN_PROGRESS,
  });
  const { serviceType } = enhancedMessage;
  // Getting message processors
  let messageProcessor = getMessageProcessor(serviceType);
  if (!messageProcessor) {
    throw new Error(
      MESSAGE_LISTENER_INTERNAL_RESPONSES.UNABLE_TO_GET_MESSAGE_PROCESSOR
    );
  }
  logger.info(`Message processor finalised for message: ${messageKey}`, {
    enhancedMessage: enhancedMessage,
  });
  enhancedMessage.messageProcessor = messageProcessor;
  await processMessageByProcessor(enhancedMessage);
};

const messageRefactorAdapter = (receivedMessage) => {
  let { message, messageForwadedBy, additionalData } = receivedMessage;
  let newMessage = {};
  if (messageForwadedBy == SUPPORTED_MESSAGE_CHANNELS.APACHE_KAFKA) {
    newMessage = kafkaMessageRefactor(receivedMessage);
  }
  return newMessage;
};

const kafkaMessageRefactor = (receivedMessage) => {
  let { message, messageForwadedBy, additionalData } = receivedMessage;
  let processedMessage = {
    key: "",
    body: "",
  };
  if (message.key) {
    processedMessage.key = message.key?.toString();
  }
  if (message.value) {
    processedMessage.body = JSON.parse(message.value?.toString());
  }
  return processedMessage;
};

module.exports = {
  processMessage,
};
