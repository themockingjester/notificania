const { HTTP_CODES } = require("../constants/httpCodes.constant");
const { MESSAGE_LISTENER_INTERNAL_RESPONSES } = require("../constants/messangingChannel.constant");
const ServiceTypeService = require("../services/serviceType.services")

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
}
module.exports = {
    messageEnhancer
}