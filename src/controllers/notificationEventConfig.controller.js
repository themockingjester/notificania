const { HTTP_CODES } = require("../constants/httpCodes.constant")
const { NOTIFICATION_EVENT_CONFIG_TABLE_CONSTANTS } = require("../constants/notificationEventConfig.constant")
const { SERVER_RESPONSES } = require("../constants/serverResponse.constant")
const NotificationEventConfigService = require("../services/notificationEventConfig.services")
const { generateResponse } = require("../utils/common.utils")

const addNotificationEventConfigController = async (req, res) => {
    let configData = req.body
    try {
        let result = await NotificationEventConfigService.addNewNotificationEventConfig(configData)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}


const updateNotificationEventConfigController = async (req, res) => {
    let notificationEventConfigData = req.body
    const { notificationEventConfigId } = req.params
    try {
        let result = await NotificationEventConfigService.updateExistingNotificationEventConfig(notificationEventConfigData, notificationEventConfigId)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
const fetchAllNotificationEventConfigController = async (req, res) => {
    try {
        let result = await NotificationEventConfigService.findAllNotificationEventConfigs({
            whereClause: {
                record_status: NOTIFICATION_EVENT_CONFIG_TABLE_CONSTANTS.RECORD_STATUS.ACTIVE
            }
        })
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
const fetchSpecificNotificationEventConfigController = async (req, res) => {
    const { notificationEventConfigId } = req.params
    try {
        let result = await NotificationEventConfigService.findSpecificNotificationEventConfig(notificationEventConfigId)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
module.exports = {
    addNotificationEventConfigController, fetchAllNotificationEventConfigController, fetchSpecificNotificationEventConfigController, updateNotificationEventConfigController
}