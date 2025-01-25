const { HTTP_CODES } = require("../constants/httpCodes.constant")
const { SERVER_RESPONSES } = require("../constants/serverResponse.constant")
const ServiceTypeService = require("../services/serviceType.services")
const { generateResponse } = require("../utils/common.utils")

const addServiceTypeController = async (req, res) => {
    let serviceData = req.body
    try {
        let result = await ServiceTypeService.addNewServiceType(serviceData)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}

const updateServiceTypeController = async (req, res) => {
    let serviceData = req.body
    const { serviceId } = req.params
    try {
        let result = await ServiceTypeService.updateExistingServiceType(serviceData, serviceId)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
const fetchAllServiceTypeController = async (req, res) => {
    try {
        let result = await ServiceTypeService.findAllServices()
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}
const fetchSpecificServiceController = async (req, res) => {
    const { serviceId } = req.params
    try {
        let result = await ServiceTypeService.findSpecificService(serviceId)
        return res.status(result.code).send(generateResponse(result.success, result.message, result.data, result.code))
    } catch (error) {
        return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(generateResponse(false, SERVER_RESPONSES.INTERNAL_SERVER_ERROR, { error: error.message }, HTTP_CODES.INTERNAL_SERVER_ERROR))
    }
}

module.exports = {
    addServiceTypeController, updateServiceTypeController, fetchAllServiceTypeController, fetchSpecificServiceController
}