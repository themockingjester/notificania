const config = require("../../../../config.json");
const {
  MESSAGE_LISTENER_INTERNAL_RESPONSES,
} = require("../../../constants/messangingChannel.constant");
const { resultObject } = require("../../common.utils");
const { HTTP_CODES } = require("../../../constants/httpCodes.constant");
const { logger } = require("../../../di-container");
const dataWareHouseHelperFunctions = require("../../dataWareHouseUtils/dataWareHouseHelperFunctions");
const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../../../constants/apacheCassandra.constant");
const { SmsStrategy } = require("./smsStrategies");
const accountSid = config.SMS_TOOLS["TWILIO"].ACCOUNT_SID;
const authToken = config.SMS_TOOLS["TWILIO"].AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);

class TwilioSMSStrategy extends SmsStrategy {
  initialize() {}

  validateProvidedBodyForSendingSMS(twilioData) {
    if (!twilioData) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_CORE_DATA_FOR_TWILIO_SMS_STRATEGY
      );
    }
    let { fromPhone, toPhone, body } = twilioData;

    if (!fromPhone) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_FROM_PHONE_KEY_FROM_TWILIO_PROVIDED_DATA
      );
    }
    if (!toPhone) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_TO_PHONE_KEY_FROM_TWILIO_PROVIDED_DATA
      );
    }
    if (!body) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_BODY_KEY_FROM_TWILIO_PROVIDED_DATA
      );
    }
  }
  async sendSMS({ twilioData, message }) {
    const messageKey = message.key.toString();

    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: messageKey,
        input_data: JSON.stringify({ twilioData, message }),
        output_data: JSON.stringify({
          response: `Message reached to twilio send sms method`,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );
    this.validateProvidedBodyForSendingSMS(twilioData);
    logger.info(
      `Validated Provided body for sending sms for message: ${messageKey}`,
      {
        twilioData: twilioData,
      }
    );
    let { fromPhone, toPhone, body } = twilioData;
    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: messageKey,
        input_data: JSON.stringify({ twilioData, message }),
        output_data: JSON.stringify({
          response: `Twilio send sms initiated`,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );

    let response = await twilioClient.messages
      .create({
        body: body,
        from: fromPhone,

        to: toPhone,
      })

      if(response.status === 201){
        await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
          {
            message_id: messageKey,
            input_data: JSON.stringify({}),
            output_data: JSON.stringify({
              response: `Twilio send sms completed`,
              apiResponseBody: response,
            }),
            process_status:
              APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS
                .NOTIFICATION_DETAILED_LOGS.PROCESS_STATUS
                .SUCCESSFULLY_PROCESSED,
          }
        );
        logger.info(
          `Received response for twilio for sms message: ${messageKey}`,
          {
            mailjetResponse: response,
          }
        );
        return resultObject(
          true,
          `Successfully sent sms via twilio`,
          {
            responseBody: response,
          },
          HTTP_CODES.OK
        );
      } else {
        await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
          {
            message_id: messageKey,
            input_data: JSON.stringify({}),
            output_data: JSON.stringify({
              response: `Twilio send sms failed`,
              error: error,
              responseStatus: response.status,
              responseBody: response.body,
            }),
            process_status:
              APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS
                .NOTIFICATION_DETAILED_LOGS.PROCESS_STATUS.FAILED,
          }
        );
        logger.error(
          `Error: Received response for twilio for message: ${messageKey}`,
          {
            error: error,
            responseStatus: response.status,
            responseBody: response.body,
          }
        );
        return resultObject(
          false,
          `Failed to sent sms`,
          {
            error: error,
          },
          HTTP_CODES.INTERNAL_SERVER_ERROR
        );
      }
     
  }
}

module.exports = new TwilioSMSStrategy();
