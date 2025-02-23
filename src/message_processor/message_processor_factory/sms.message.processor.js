const {
  APPLICATION_CONSTANTS,
} = require("../../constants/application.constant");
const twilioSmsStrategy = require("../../utils/smsUtilities/smsStrategies/twilioSmsStrategy");
const {
  DEFAULT_MESSAGE_PROCESSOR_CONSTANTS,
} = require("../../constants/message_processor/message.processor.constant");

const {
  applyEnhancementAndValidatorsForMessageProcessorOnProvidedData,
} = require("../../utils/messageProcessorUtils");
const { config, logger } = require("../../di-container");
const {
  MESSAGE_LISTENER_INTERNAL_RESPONSES,
} = require("../../constants/messangingChannel.constant");

const { resultObject } = require("../../utils/common.utils");
const dataWareHouseHelperFunctions = require("../../utils/dataWareHouseUtils/dataWareHouseHelperFunctions");
const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../../constants/apacheCassandra.constant");
const {
  getSMSStrategy,
} = require("../../utils/smsUtilities/smsStrategies/getSmsStrategy");
const {
  SMS_MESSAGE_PROCESSOR_CONSTANTS,
} = require("../../constants/message_processor/sms.message.processor");

class SMSMessageProcessor {
  processorType =
    APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR.SMS_MESSAGE_PROCESSOR;
  async sendSMSAux(message) {
    const messageKey = message.key.toString();
    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: messageKey,
        input_data: JSON.stringify({
          message: message,
        }),
        output_data: JSON.stringify({
          response: `Reached send sms aux method`,
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
        SMS_MESSAGE_PROCESSOR_CONSTANTS.SEND_SMS.NEEDED_KEYS_FOR_CONFIG,
      templateType:
        APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES_ADDITIONAL_DATA.SEND_SMS
          .SUPPORTED_MESSAGE_TEMPALTE,
    });

    logger.info(
      `Successfully applied validators and enhancers for the sms message: ${messageKey}`,
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
    const mailingResponse = await this.sendSMS(message);
    return resultObject(
      mailingResponse.success,
      mailingResponse.message,
      mailingResponse.data,
      mailingResponse.code
    );
  }

  async sendSMS(message) {
    const messageKey = message.key.toString();
    let smsStrategy;
    let objBody = {};
    let senderUsed = "";
    let { eventConfig, body, templateBody } = message;
    logger.info(`Message reached to main sendSMS method : ${messageKey}`);
    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: messageKey,
        input_data: JSON.stringify({
          message: message,
        }),
        output_data: JSON.stringify({
          response: `Message reached to main sendSMS method`,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );
    if (config.SMS_TOOLS["TWILIO"].ENABLED) {
      smsStrategy = getSMSStrategy(twilioSmsStrategy);
      objBody = {
        twilioData: {
          fromPhone: eventConfig?.fromPhone,
          toPhone: body.receipientPhone,
          body: templateBody,
        },
        message: message,
      };
      senderUsed =
        APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES_ADDITIONAL_DATA.SEND_SMS
          .SENDER_SUPPORTED.TWILIO;
    } else {
      logger.error(
        `Action for message ${messageKey} was to send sms but seems like sms tool is disabled`,
        {
          message: message,
        }
      );
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.UN_EXPECTED_SMS_STRATEGY_FOUND
      );
    }
    const coreResponseObject = await smsStrategy.sendSMS(objBody);
    coreResponseObject.data.senderUsed = senderUsed;
    const refinedResponseObject = await this.sendSMSAuxResponseAdapter(
      coreResponseObject
    );
    return resultObject(
      refinedResponseObject.success,
      refinedResponseObject.message,
      refinedResponseObject.data,
      refinedResponseObject.code
    );
  }

  /**
   * This function converts the final response into a command similar object format
   * @param {JSON Object} response
   * @returns JSON
   */
  async sendSMSAuxResponseAdapter(response) {
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

module.exports = new SMSMessageProcessor();
