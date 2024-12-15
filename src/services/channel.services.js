
const { resultObject, generateUUIDV4 } = require("../utils/common.utils")
const { HTTP_CODES } = require("../constants/httpCodes.constant")
const { exportedDIContainer } = require("../exportedDiContainer");
const config = require("../../config.json");
const { MESSAGING_CHANNEL_RESPONSES } = require("../constants/messangingChannel.constant");
class ChannelService {
    constructor() {
    }

    async sendMessage(message) {
        if (config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.ENABLED) {
            message.key = generateUUIDV4()
            await exportedDIContainer.messageChannels.kafka.producer.sendMessage(message);
        }

        return resultObject(true, MESSAGING_CHANNEL_RESPONSES.MESSAGE_ACCEPTED, { id: message.key }, HTTP_CODES.ACCEPTED)
    }
}


module.exports = new ChannelService()
