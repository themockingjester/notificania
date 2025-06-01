const {
  APPLICATION_CONSTANTS,
} = require("../../constants/application.constant");
const {
  PUSH_NOTIFICATION_MESSAGE_PROCESSOR_CONSTANTS,
} = require("../../constants/message_processor/firebase.message.processor.constant");
const firebasePushNotificationStrategy = require("../../utils/pushNotificationUtilities/firebasePushNotificationStrategy");
const {
  DEFAULT_MESSAGE_PROCESSOR_CONSTANTS,
} = require("../../constants/message_processor/message.processor.constant");
const { config, logger } = require("../../di-container");
const {
  applyEnhancementAndValidatorsForMessageProcessorOnProvidedData,
} = require("../../utils/messageProcessorUtils");
const {
  getPushNotificationStrategy,
} = require("../../utils/pushNotificationUtilities/getPushNotificationStrategy");
const {
  MESSAGE_LISTENER_INTERNAL_RESPONSES,
} = require("../../constants/messangingChannel.constant");
const dataWareHouseHelperFunctions = require("../../utils/dataWareHouseUtils/dataWareHouseHelperFunctions");
const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../../constants/apacheCassandra.constant");
const { resultObject } = require("../../utils/common.utils");

class PushNotificationMessageProcessor {
  processorType =
    APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR
      .PUSH_NOTIFICATION_MESSAGE_PROCESSOR;
  async pushNotificationAux(message) {
    const messageKey = message.key.toString();
    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: messageKey,
        input_data: JSON.stringify({
          message: message,
        }),
        output_data: JSON.stringify({
          response: `Reached send push notification aux method`,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );
    await applyEnhancementAndValidatorsForMessageProcessorOnProvidedData({
      enhancementType:
        DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_ENHANCER_TYPES.DEFAULT,
      validatorType:
        DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_VALIDATOR_TYPES.DEFAULT,
      applyValidation: true,
      applyEnhancement: true,
      message,
      configBasedNeedKeysForValidator:
        PUSH_NOTIFICATION_MESSAGE_PROCESSOR_CONSTANTS.PUSH_NOTIFICATION
          .NEEDED_KEYS_FOR_CONFIG,
      templateType:
        APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES_ADDITIONAL_DATA
          .SEND_PUSH_NOTIFICATION.SUPPORTED_MESSAGE_TEMPALTE,
    });

    logger.info(
      `Successfully applied validators and enhancers for the push notification message: ${messageKey}`,
      {
        enhancedMessage: message,
      }
    );

    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: messageKey,
        input_data: JSON.stringify({
          message: message,
        }),
        output_data: JSON.stringify({
          response: `Enhancement and validation for message processor is done`,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );
    const pushNotificationResponse = await this.sendPushNotification(message);
    return resultObject(
      pushNotificationResponse.success,
      pushNotificationResponse.message,
      pushNotificationResponse.data,
      pushNotificationResponse.code
    );
  }

  async sendPushNotification(message) {
    const messageKey = message.key.toString();
    let pushNotificationStrategy;
    let objBody = {};
    let senderUsed = "";
    let { eventConfig, body, templateBody } = message;

    
    logger.info(
      `Message reached to main sendPushNotification method : ${messageKey}`
    );
    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: messageKey,
        input_data: JSON.stringify({
          message: message,
        }),
        output_data: JSON.stringify({
          response: `Message reached to main sendPushNotification method`,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );
    if (config.PUSH_NOTIFICATION_TOOLS["FIREBASE"].ENABLED) {
      pushNotificationStrategy = getPushNotificationStrategy(
        firebasePushNotificationStrategy
      );
      objBody = {
        firebasePushNotificationData: {
          deviceFcmToken: body.deviceFcmToken,
          eventConfig,
          body: templateBody,
          eventId: body.eventId,
          notification: body.notification,
        },
        message: message,
      };
      senderUsed =
        APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES_ADDITIONAL_DATA
          .SEND_PUSH_NOTIFICATION.SENDER_SUPPORTED.FIREBASE;
    } else {
      logger.error(
        `Action for message ${messageKey} was to send push notification but seems like push notification tool is disabled`,
        {
          message: message,
        }
      );
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.UN_EXPECTED_PUSH_NOTIFICATION_STRATEGY_FOUND
      );
    }
    const coreResponseObject =
      await pushNotificationStrategy.sendPushNotification(objBody);
    coreResponseObject.data.senderUsed = senderUsed;
    const refinedResponseObject =
      await this.sendPushNotificationAuxResponseAdapter(coreResponseObject);
    return resultObject(
      refinedResponseObject.success,
      refinedResponseObject.message,
      refinedResponseObject.data,
      refinedResponseObject.code
    );
  }

  async sendPushNotificationAuxResponseAdapter(response) {
    // Here we can do things like logging etc

    let finalDataToReturn = {};
    if (response.data.senderUsed) {
      finalDataToReturn.senderUsed = response.data.senderUsed;
    }
    return resultObject(
      response.success,
      response.message,
      finalDataToReturn,
      response.code
    );
  }
}

module.exports = new PushNotificationMessageProcessor();
