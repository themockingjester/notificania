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

    try {
      // Generate a unique app name using eventId and a hash of the service account
      const serviceAccountHash = JSON.stringify(serviceAccountFile).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const uniqueAppName = `${eventId}_${serviceAccountHash}`;

      // Check if app is already initialized with this exact service account
      const existingApp = admin.apps.find((app) => app.name === uniqueAppName);
      if (existingApp) {
        logger.info(`Firebase app ${uniqueAppName} already initialized with this service account`);
        return uniqueAppName;
      }

      // If there's an existing app with the same eventId but different service account, delete it
      const oldApp = admin.apps.find((app) => app.name.startsWith(eventId + '_'));
      if (oldApp) {
        logger.info(`Deleting old Firebase app ${oldApp.name} to initialize with new service account`);
        await oldApp.delete();
      }

      // Initialize new app with unique name
      logger.info(`Initializing Firebase app ${uniqueAppName} with new service account`);
      const app = admin.initializeApp(
        { 
          credential: admin.credential.cert(serviceAccountFile),
          projectId: serviceAccountFile.project_id
        },
        uniqueAppName
      );

      // Verify initialization
      if (!app) {
        throw new Error(`Failed to initialize Firebase app ${uniqueAppName}`);
      }

      logger.info(`Successfully initialized Firebase app ${uniqueAppName}`);
      return uniqueAppName;
    } catch (error) {
      logger.error(`Error initializing Firebase app for event ${eventId}:`, error);
      throw new Error(`Failed to initialize Firebase client: ${error.message}`);
    }
  }

  notificationObjectRefactor(firebasePushNotificationData,message) {
    let { body } = message;
    let { notification } = body;
    if (!notification) {
      throw new Error("Notification object is not present");
    }
    let notificationBody = "";
    let { body: providedBody } = body?.notification;
    if (providedBody) {
      notificationBody = providedBody;
    } else {
      notificationBody = templateBody;
    }
    notification.body = notificationBody;
    firebasePushNotificationData.notification = notification;
  }

  async sendPushNotification({ firebasePushNotificationData, message }) {
    const messageKey = message.key.toString();
    this.notificationObjectRefactor(firebasePushNotificationData, message);
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

    let appName = await this.initializeFirebaseClient(firebasePushNotificationData);
    if (!appName) {
      throw new Error(`Unable to initialize firebase client`);
    }

    // Add the appName to the push notification data
    firebasePushNotificationData.appName = appName;

    let result = await this.sendPushNotificationToUser(firebasePushNotificationData);
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
    let { eventId, deviceFcmToken, notification, appName } = firebasePushNotificationData;
    
    try {
      // Get the initialized app using the unique app name
      const app = admin.app(appName);
      if (!app) {
        throw new Error(`Firebase app ${appName} not found`);
      }

      logger.info(`Sending push notification using Firebase app ${appName}`);
      const response = await app.messaging().send({
        token: deviceFcmToken,
        notification: notification,
      });
      
      logger.info(`Successfully sent push notification for app ${appName}`);
      return response;
    } catch (error) {
      logger.error(`Error sending push notification for app ${appName}:`, error);
      throw error;
    }
  }
}

module.exports = new FirebasePushNotificationStrategy();
