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
const admin = require("firebase-admin");

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

  async initializeFirebaseClient(data) {
    let { eventConfig, eventId } = data;
    if (!eventConfig) {
      throw new Error(
        "UNABLE_TO_FIND_EVENT_CONFIG_WHILE_INITIALIZING_FIREBASE_CLIENT"
      );
    }
    let { serviceAccountFile } = eventConfig;

    if (!serviceAccountFile) {
      throw new Error(
        "UNABLE_TO_FIND_SERVICE_ACCOUNT_FILE_WHILE_INITIALIZING_FIREBASE_CLIENT"
      );
    }

    if (!admin.apps.find((app) => app.name === eventId)) {
      admin.initializeApp(
        { credential: admin.credential.cert(serviceAccountFile) },
        eventId
      );
    }
    return true;
  }
  async sendPushNotification({ firebasePushNotificationData, message }) {
    const messageKey = message.key.toString();

    await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
      {
        message_id: messageKey,
        input_data: JSON.stringify({ firebasePushNotificationData, message }),
        output_data: JSON.stringify({
          response: `Message reached to firebase send push notification method`,
        }),
        process_status:
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
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
          APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
            .PROCESS_STATUS.IN_PROGRESS,
      }
    );

    let isFirebaseInitiliased = await this.initializeFirebaseClient(
      firebasePushNotificationData
    );
    if (!isFirebaseInitiliased) {
      throw new Error(`Unbable to initialize firebase client`);
    }

    let result = await this.sendPushNotificationToUser(
      firebasePushNotificationData
    );
    if (result) {
      return resultObject(
        true,
        `Sent push notification successfully`,
        { response: result },
        httpCodesConstant.HTTP_CODES.OK
      );
    } else {
      return resultObject(
        false,
        `Failed to send push notification from firebase`,
        { error: "UNEXPECTED_RESPONSE_RECEIVED_FROM_FIREBASE" },
        httpCodesConstant.HTTP_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sendPushNotificationToUser(firebasePushNotificationData) {
    let { eventId, deviceFcmToken, notification } =
      firebasePushNotificationData;
    const app = admin.app(eventId); // get the initialized app
    const response = await app.messaging().send({
      token: deviceFcmToken,
      notification: notification,
    });
    return response;
  }
}

module.exports = new FirebasePushNotificationStrategy();
