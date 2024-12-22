const { HTTP_CODES } = require("../constants/httpCodes.constant");
const { MESSAGE_LISTENER_INTERNAL_RESPONSES } = require("../constants/messangingChannel.constant");
const ServiceTypeService = require("../services/serviceType.services")
const NotificationEventConfigService = require("../services/notificationEventConfig.services");
const { NOTIFICATION_EVENT_CONFIG_TABLE_CONSTANTS } = require("../constants/notificationEventConfig.constant");
const { prepareProperObjectOutOfNotificationEventConfigDetailsForAMessage } = require("../utils/messageUtilities/common.message.utils");

const messageEnhancer = async (receivedMessage) => {
    let { body } = receivedMessage;
    if (!body?.serviceId) {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.SERVICE_TYPE_MISSING)
    }

    const { serviceId } = body
    // fetching service
    let serviceDetails = await ServiceTypeService.findSpecificService(serviceId)
    let serviceName = ''
    if (serviceDetails.code == HTTP_CODES.OK && serviceDetails.success) {
        serviceName = serviceDetails?.data?.result?.service_name
    } else {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.UNKNOWN_SERVICE_PROVIDED)
    }
    if (!serviceName) {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.SERVICE_TYPE_NOT_FOUND)
    }
    receivedMessage.serviceType = serviceName
    await attachMessageEventBasedConfig(receivedMessage)
}
const attachMessageEventBasedConfig = async (receivedMessage) => {
    let { body } = receivedMessage;
    if (!body?.eventId) {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.EVENT_ID_MISSING)
    }

    const { eventId } = body
    // fetching config data
    let configData = await NotificationEventConfigService.findAllNotificationEventConfigs({
        whereClause: {
            event_id: eventId,
            record_status: NOTIFICATION_EVENT_CONFIG_TABLE_CONSTANTS.RECORD_STATUS.ACTIVE
        }
    })
    let config
    if (configData.code == HTTP_CODES.OK && configData.success) {
        config = configData?.data?.result
    } else {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.UNKNOWN_EVENT_PROVIDED)
    }
    if (!config) {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.NO_NOTIFICATION_EVENT_BASED_CONFIG_FOUND)
    }
    const refinedConfigs = prepareProperObjectOutOfNotificationEventConfigDetailsForAMessage(config)
    receivedMessage.eventConfig = refinedConfigs

}
module.exports = {
    messageEnhancer, attachMessageEventBasedConfig
}