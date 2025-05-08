const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../../constants/apacheCassandra.constant");
const {
  APPLICATION_CONSTANTS,
} = require("../../constants/application.constant");
const {
  MESSAGE_LISTENER_INTERNAL_RESPONSES,
} = require("../../constants/messangingChannel.constant");
const { logger } = require("../../di-container");
const dataWareHouseHelperFunctions = require("../../utils/dataWareHouseUtils/dataWareHouseHelperFunctions");
const pushNotificationMessageProcessor = require("./push_notification.message.processor");
const mailMessageProcessor = require("./mail.message.processor");
const smsMessageProcessor = require("./sms.message.processor");
const getMessageProcessor = (serviceType) => {
  if (
    serviceType ==
    APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES.PUSH_NOTIFICATION
  ) {
    return pushNotificationMessageProcessor;
  } else if (
    serviceType == APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES.SEND_MAIL
  ) {
    return mailMessageProcessor;
  } else if (
    serviceType == APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES.SEND_SMS
  ) {
    return smsMessageProcessor;
  } else {
    throw new Error(
      MESSAGE_LISTENER_INTERNAL_RESPONSES.UNIMPLEMENTED_SERVICE_PROVIDED
    );
  }
};

const processMessageByProcessor = async (message) => {
  const { messageProcessor, key } = message;

  if (
    messageProcessor.processorType ==
    APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR
      .PUSH_NOTIFICATION_MESSAGE_PROCESSOR
  ) {
    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: key,
        input_data: JSON.stringify({
          message,
        }),
        output_data: JSON.stringify({
          response: `Message processor identified`,
          processor: messageProcessor.processorType,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );
    return processPushNotificationMessage(message);
  } else if (
    messageProcessor.processorType ==
    APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR.MAIL_MESSAGE_PROCESSOR
  ) {
    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: key,
        input_data: JSON.stringify({
          message,
        }),
        output_data: JSON.stringify({
          response: `Message processor identified`,
          processor: messageProcessor.processorType,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );
    return processMailMessage(message);
  } else if (
    messageProcessor.processorType ==
    APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR.SMS_MESSAGE_PROCESSOR
  ) {
    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: key,
        input_data: JSON.stringify({
          message,
        }),
        output_data: JSON.stringify({
          response: `Message processor identified`,
          processor: messageProcessor.processorType,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );
    return processSMSMessage(message);
  } else {
    throw new Error(
      MESSAGE_LISTENER_INTERNAL_RESPONSES.INVALID_MESSAGE_PROCESSOR_FOUND
    );
  }
};

const processPushNotificationMessage = (message) => {
  const { serviceType } = message;
  const messageKey = message.key.toString();
  logger.info(
    `Reached the core activity initiating function for the push message: ${messageKey}`
  );
  if (
    serviceType ==
    APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES.PUSH_NOTIFICATION
  ) {
    return message.messageProcessor.pushNotificationAux(message);
  } else {
    throw new Error(
      MESSAGE_LISTENER_INTERNAL_RESPONSES.UNABLE_TO_IDENTIFY_CORRECT_FUNCTION_FOR_GIVEN_SERVICE_TYPE
    );
  }
};

const processMailMessage = (message) => {
  const { serviceType } = message;
  const messageKey = message.key.toString();
  logger.info(
    `Reached the core activity initiating function for the mail message: ${messageKey}`
  );
  if (serviceType == APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES.SEND_MAIL) {
    return message.messageProcessor.sendMailAux(message);
  } else {
    throw new Error(
      MESSAGE_LISTENER_INTERNAL_RESPONSES.UNABLE_TO_IDENTIFY_CORRECT_FUNCTION_FOR_GIVEN_SERVICE_TYPE
    );
  }
};

const processSMSMessage = (message) => {
  const { serviceType } = message;
  const messageKey = message.key.toString();
  logger.info(
    `Reached the core activity initiating function for the sms message: ${messageKey}`
  );
  if (serviceType == APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES.SEND_SMS) {
    return message.messageProcessor.sendSMSAux(message);
  } else {
    throw new Error(
      MESSAGE_LISTENER_INTERNAL_RESPONSES.UNABLE_TO_IDENTIFY_CORRECT_FUNCTION_FOR_GIVEN_SERVICE_TYPE
    );
  }
};

module.exports = {
  getMessageProcessor,
  processMessageByProcessor,
};
