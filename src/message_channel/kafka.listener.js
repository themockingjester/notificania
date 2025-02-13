const { CACHING_CONSTANTS } = require("../constants/caching.constant");
const {
  SUPPORTED_MESSAGE_CHANNELS,
} = require("../constants/messangingChannel.constant");
const { exportedDIContainer } = require("../exportedDiContainer");
const { fetchData } = require("../utils/dataProxies/genericData.proxy");
const { processMessage } = require("./message_utility");
const NotificationTrackService = require("../services/notificationTrack.services");
const {
  NOTIFICATION_TRACK_TABLE_CONSTANTS,
} = require("../constants/notificationTrack.constant");
const { logger } = require("../di-container");
const dataWareHouseHelperFunctions = require("../utils/dataWareHouseUtils/dataWareHouseHelperFunctions");
const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../constants/apacheCassandra.constant");

class KafkaMessageListener {
  async initialize() {
    await exportedDIContainer.messageChannels.kafka.consumer.consumer.consumer.run(
      {
        eachMessage: async ({
          topic,
          partition,
          message,
          heartbeat,
          pause,
        }) => {
          let { key: messageKey, value } = message;
          messageKey = messageKey.toString();
          logger.info(`Received message to process ${messageKey}`, {
            messageValue: value.toString(),
          });

          await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
            {
              message_id: messageKey,
              input_data: JSON.stringify({
                message: value.toString(),
              }),
              output_data: JSON.stringify({
                response: `Message retrieved from to Kafka consumer`,
              }),
              process_status:
                APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS
                  .NOTIFICATION_DETAILED_LOGS.PROCESS_STATUS.IN_PROGRESS,
            }
          );

          try {
            // checking message already processed previously
            let processedMessage = await fetchData({
              useCache: true,
              cacheExpiryTime:
                CACHING_CONSTANTS.IN_APP_CACHES.DEFAULT_CACHE_EXPIRY
                  .SUCCESSFULLY_PROCESSED_MESSAGE_EXPIRY,
              cacheName:
                CACHING_CONSTANTS.IN_APP_CACHES.CACHE_NAMES
                  .SUCCESSFULLY_PROCESSED_MESSAGE,
              cacheKey: messageKey,
              functionToCall:
                NotificationTrackService.findSpecificNotificationTracker(
                  messageKey
                ),
            });

            //TODO: need to check the the code and success keys also from object like processedMessage in this file later for better reliability
            if (
              [
                NOTIFICATION_TRACK_TABLE_CONSTANTS.ALLOWED_STATUS.PROCESSED,
              ].includes(processedMessage.data.data.result.status)
            ) {
              // Message was already processed
              logger.info(
                `Message with key ${messageKey} was already processed`
              );
              await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs(
                {
                  message_id: messageKey,
                  input_data: JSON.stringify({}),
                  output_data: JSON.stringify({
                    error: `Message with key ${messageKey} was already processed`,
                  }),
                  process_status:
                    APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS
                      .NOTIFICATION_DETAILED_LOGS.PROCESS_STATUS
                      .SUCCESSFULLY_PROCESSED,
                }
              );
            } else {
              let finalResponse = await processMessage({
                message: message,
                messageForwadedBy: SUPPORTED_MESSAGE_CHANNELS.APACHE_KAFKA,
                additionalData: {
                  topic,
                  partition,
                  heartbeat,
                  pause,
                },
              });

              logger.info(
                `Successfully processed message with key: ${messageKey}`
              );
              await NotificationTrackService.updateNotificationTrackerCore({
                data: {
                  status:
                    NOTIFICATION_TRACK_TABLE_CONSTANTS.ALLOWED_STATUS.PROCESSED,
                  final_response: JSON.stringify(finalResponse),
                },
                whereClause: {
                  id: messageKey,
                },
              });

              let updatedMessageValue =
                await NotificationTrackService.findSpecificNotificationTracker(
                  messageKey
                );
              await exportedDIContainer.caching.strategy.setKey({
                cacheName:
                  CACHING_CONSTANTS.IN_APP_CACHES.CACHE_NAMES
                    .SUCCESSFULLY_PROCESSED_MESSAGE,
                key: messageKey,
                dataToCache: updatedMessageValue,
                expiryInSeconds:
                  CACHING_CONSTANTS.IN_APP_CACHES.DEFAULT_CACHE_EXPIRY
                    .SUCCESSFULLY_PROCESSED_MESSAGE_EXPIRY,
              });
            }
          } catch (error) {
            logger.error(
              `Failed to process message having key: ${messageKey}`,
              {
                reason: error.message,
                stack: error.stack,
              }
            );

            await NotificationTrackService.updateNotificationTrackerCore({
              data: {
                status:
                  NOTIFICATION_TRACK_TABLE_CONSTANTS.ALLOWED_STATUS.FAILED,
                final_response: error.message,
              },
              whereClause: {
                id: messageKey,
              },
            });
            let updatedMessageValue =
              await NotificationTrackService.findSpecificNotificationTracker(
                messageKey
              );
            await exportedDIContainer.caching.strategy.setKey({
              cacheName:
                CACHING_CONSTANTS.IN_APP_CACHES.CACHE_NAMES
                  .SUCCESSFULLY_PROCESSED_MESSAGE,
              key: messageKey,
              dataToCache: updatedMessageValue,
              expiryInSeconds:
                CACHING_CONSTANTS.IN_APP_CACHES.DEFAULT_CACHE_EXPIRY
                  .SUCCESSFULLY_PROCESSED_MESSAGE_EXPIRY,
            });
          }
        },
      }
    );
  }
}

module.exports = new KafkaMessageListener();
