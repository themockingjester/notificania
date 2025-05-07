const {
  MESSAGE_LISTENER_INTERNAL_RESPONSES,
} = require("../../constants/messangingChannel.constant");
const { resultObject } = require("../../utils/common.utils");
const { logger } = require("../../di-container");
const dataWareHouseHelperFunctions = require("../dataWareHouseUtils/dataWareHouseHelperFunctions");
const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../../constants/apacheCassandra.constant");
const { PushNotificationStrategy } = require("./pushNotificationStrategy");
const httpCodesConstant = require("../../constants/httpCodes.constant");

class FirebasePushNotificationStrategy extends PushNotificationStrategy {
  initialize() {}

  validateProvidedBodyForSendingPushNotification(firebasePushNotificationData) {
    if (!firebasePushNotificationData) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_CORE_DATA_FOR_FIREBASE_PUSH_NOTIFICATION_STRATEGY
      );
    }
    const { deviceFcmToken, body } = firebasePushNotificationData;
    if (!deviceFcmToken) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_DEVICE_FCM_TOKEN_FROM_GENERATED_FIREBASE_PUSH_NOTIFICATION_OBJECT
      );
    }

    if (!body) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_BODY_FROM_GENERATED_FIREBASE_PUSH_NOTIFICATION_OBJECT
      );
    }
  }
  async sendPushNotification({ firebasePushNotificationData, message }) {
    return new Promise(async (resolve, reject) => {
      const messageKey = message.key.toString();

      await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
        {
          message_id: messageKey,
          input_data: JSON.stringify({ firebasePushNotificationData, message }),
          output_data: JSON.stringify({
            response: `Message reached to firebase send push notification method`,
          }),
          process_status:
            APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS
              .NOTIFICATION_DETAILED_LOGS.PROCESS_STATUS.IN_PROGRESS,
        }
      );
      this.validateProvidedBodyForSendingPushNotification(
        firebasePushNotificationData
      );
      logger.info(
        `Validated Provided body for sending firebase push notification for message: ${messageKey}`,
        {
          firebasePushNotificationData: firebasePushNotificationData,
        }
      );
      await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
        {
          message_id: messageKey,
          input_data: JSON.stringify({ firebasePushNotificationData, message }),
          output_data: JSON.stringify({
            response: `Firebase push notification send initiated`,
          }),
          process_status:
            APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS
              .NOTIFICATION_DETAILED_LOGS.PROCESS_STATUS.IN_PROGRESS,
        }
      );
      console.log(firebasePushNotificationData, 5667);
      return resolve(
        resultObject(
          true,
          `Sent push notification successfully`,
          {},
          httpCodesConstant.HTTP_CODES.OK
        )
      );
    });
  }
}

module.exports = new FirebasePushNotificationStrategy();
