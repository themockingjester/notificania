const ServiceConfigRepository = require("../repositories/serviceConfig.repository")
const { Op } = require("sequelize");

const { resultObject } = require("../utils/common.utils")
const { HTTP_CODES } = require("../constants/httpCodes.constant")
const { exportedDIContainer } = require("../exportedDiContainer");
const { DATABASE_CONSTANTS } = require("../constants/database.constant");

class ServiceConfigService {
    serviceConfigRepository
    isDefaultDbModelSet = false
    constructor() {
        this.serviceConfigRepository = new ServiceConfigRepository()
    }
    intiateDefaultRepository() {
        this.serviceConfigRepository.setModel(exportedDIContainer.dbModels[DATABASE_CONSTANTS.TABLES.SERVICE_CONFIG])
    }
    async checkForDefaultModel() {
        if (!this.isDefaultDbModelSet) {
            await this.intiateDefaultRepository()
            this.isDefaultDbModelSet = true
        }
    }
    findOneServiceConfigCore = async ({ whereClause }) => {
        await this.checkForDefaultModel()
        return this.serviceConfigRepository.findOne({ whereClause })
    }

    findAllServiceConfigCore = async ({ whereClause, include }) => {
        await this.checkForDefaultModel()

        return this.serviceConfigRepository.findAll({ whereClause, include })
    }
    createServiceConfigCore = async ({ data, options }) => {
        await this.checkForDefaultModel()

        return this.serviceConfigRepository.create({ data, options })
    }
    deactivateServiceConfigCore = async ({ whereClause, options }) => {
        await this.checkForDefaultModel()

        return this.serviceConfigRepository.deactivate({ whereClause, options })
    }
    updateServiceConfigCore = async ({ data, whereClause, options }) => {
        await this.checkForDefaultModel()

        return this.serviceConfigRepository.update({ data, whereClause, options })
    }

    addNewServiceConfig = async (data) => {
        await this.checkForDefaultModel()

        let { key, service_id } = data
        // checking service config exists or not
        const serviceConfigExists = await this.findOneServiceConfigCore({
            whereClause: {
                service_id: service_id,
                key: key,
                record_status: 1
            }
        })
        if (!serviceConfigExists) {
            // service config not found
            let createdService = await this.createServiceConfigCore({ data })
            return resultObject(true, `Created service config successfully`, {
                result: createdService
            }, HTTP_CODES.CREATED)
        }
        return resultObject(false, `Another similar service config already exists`, {

        }, HTTP_CODES.CONFLICT)

    }

    updateExistingServiceConfig = async (data, serviceId) => {
        await this.checkForDefaultModel()

        let { service_name } = data

        // checking service type exists or not
        const serviceConfigExists = await this.findOneServiceConfigCore({
            whereClause: {
                service_name: service_name,
                id: {
                    [Op.notIn]: [serviceId]
                }
            }
        })
        if (serviceConfigExists) {
            // similar service found
            return resultObject(false, `Similar Service already exists`, {

            }, HTTP_CODES.CONFLICT)
        }

        // update the service config
        let updatedService = await this.updateServiceConfigCore({
            data: {
                service_name: service_name
            },
            whereClause: {
                id: serviceId
            }
        })
        return resultObject(true, `Updated service config successfully`, {
            result: updatedService
        }, HTTP_CODES.OK)

    }

    findAllServiceConfigs = async () => {
        await this.checkForDefaultModel()

        const allServices = await this.findAllServiceConfigCore({
            whereClause: {
                record_status: 1
            },
            include: [
                {
                    model: exportedDIContainer.dbModels[DATABASE_CONSTANTS.TABLES.SERVICE_TYPE],
                }
            ]
        })

        return resultObject(true, `Fetched services`, {
            result: allServices
        }, HTTP_CODES.OK)

    }

    findSpecificServiceConfig = async (serviceConfigId) => {
        await this.checkForDefaultModel()

        const serviceData = await this.findOneServiceConfigCore({
            whereClause: {
                id: serviceConfigId,
                record_status: 1
            }
        })

        return resultObject(true, `Fetched service`, {
            result: serviceData
        }, HTTP_CODES.OK)

    }
}


module.exports = new ServiceConfigService()
