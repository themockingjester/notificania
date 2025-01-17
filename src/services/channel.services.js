
const { resultObject, generateUUIDV4 } = require("../utils/common.utils")
const { HTTP_CODES } = require("../constants/httpCodes.constant")
const NotificationTrackService = require("./notificationTrack.services")

const { exportedDIContainer } = require("../exportedDiContainer");
const config = require("../../config.json");
const { MESSAGING_CHANNEL_RESPONSES } = require("../constants/messangingChannel.constant");
const { NOTIFICATION_TRACK_TABLE_CONSTANTS } = require("../constants/notificationTrack.constant");
class ChannelService {
    constructor() {
    }

    async sendMessage(message) {
        let { eventId } = message
        let messageTracker = await NotificationTrackService.addNewNotificationTracker(
            {
                event_id: eventId, data: message,
                status: NOTIFICATION_TRACK_TABLE_CONSTANTS.ALLOWED_STATUS.RECEIVED
            }
        )
        if (messageTracker.code != HTTP_CODES.CREATED) {
            return resultObject(true, MESSAGING_CHANNEL_RESPONSES.FAILED_TO_CREATE_NOTIFICATION_TRACKER_FOR_MESSAGE, {}, HTTP_CODES.INTERNAL_SERVER_ERROR)
        }
        message.key = messageTracker.data.result.id
        if (config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.ENABLED) {
            await exportedDIContainer.messageChannels.kafka.producer.sendMessage(message);
        }

        return resultObject(true, MESSAGING_CHANNEL_RESPONSES.MESSAGE_ACCEPTED, { id: message.key }, HTTP_CODES.ACCEPTED)
    }
}


module.exports = new ChannelService()
