const { HTTP_CODES } = require("../constants/httpCodes.constant")
const { SERVER_RESPONSES } = require("../constants/serverResponse.constant")
const ServiceConfigService = require("../services/serviceConfig.services")
const { generateResponse } = require("../utils/common.utils")

const addServiceConfigController = async (req, res) => {
    let serviceConfigData = req.body
    try {
        let result = await ServiceConfigService.addNewServiceConfig(serviceConfigData)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}


const updateServiceConfigController = async (req, res) => {
    let serviceData = req.body
    const { serviceId } = req.params
    try {
        let result = await ServiceConfigService.updateExistingServiceConfig(serviceData, serviceId)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
const fetchAllServiceConfigController = async (req, res) => {
    try {
        let result = await ServiceConfigService.findAllServiceConfigs()
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
const fetchSpecificServiceConfigController = async (req, res) => {
    const { serviceConfigId } = req.params
    try {
        let result = await ServiceConfigService.findSpecificServiceConfig(serviceConfigId)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
module.exports = {
    addServiceConfigController, fetchAllServiceConfigController, fetchSpecificServiceConfigController, updateServiceConfigController
}