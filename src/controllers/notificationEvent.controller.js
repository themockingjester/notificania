const { HTTP_CODES } = require("../constants/httpCodes.constant")
const { SERVER_RESPONSES } = require("../constants/serverResponse.constant")
const NotificationEventService = require("../services/notificationEvent.services")
const { generateResponse } = require("../utils/common.utils")

const addNotificationEventController = async (req, res) => {
    let notificationEventData = req.body
    try {
        let result = await NotificationEventService.addNewNotificationEvent(notificationEventData)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}


const updateNotificationEventController = async (req, res) => {
    let notificationEventData = req.body
    const { notificationEventId } = req.params
    try {
        let result = await NotificationEventService.updateExistingNotificationEvent(notificationEventData, notificationEventId)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
const fetchAllNotificationEventController = async (req, res) => {
    try {
        let result = await NotificationEventService.findAllNotificationEvents()
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
const fetchSpecificNotificationEventController = async (req, res) => {
    const { notificationEventId } = req.params
    try {
        let result = await NotificationEventService.findSpecificNotificationEvent(notificationEventId)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
module.exports = {
    addNotificationEventController, fetchAllNotificationEventController, fetchSpecificNotificationEventController, updateNotificationEventController
}