const ServiceTypeRepository = require("../repositories/serviceType.repository")
const { resultObject } = require("../utils/common.utils")
const { HTTP_CODES } = require("../constants/httpCodes.constant")
const { exportedDIContainer } = require("../exportedDiContainer")

class ServiceTypeService {
    serviceTypeRepository
    isDefaultDbModelSet = false
    constructor() {
        this.serviceTypeRepository = new ServiceTypeRepository()
    }
    intiateDefaultRepository() {
        this.serviceTypeRepository.setModel(exportedDIContainer.dbModels['service_type'])
    }
    async checkForDefaultModel() {
        if (!this.isDefaultDbModelSet) {
            await this.intiateDefaultRepository()
            this.isDefaultDbModelSet = true
        }
    }
    findOneServiceType = async ({ whereClause }) => {
        await this.checkForDefaultModel()
        return this.serviceTypeRepository.findOne({ whereClause })
    }

    findAllServiceTypes = async ({ whereClause }) => {
        await this.checkForDefaultModel()

        return this.serviceTypeRepository.findAll({ whereClause })
    }
    createServiceType = async ({ data, options }) => {
        await this.checkForDefaultModel()

        return this.serviceTypeRepository.create({ data, options })
    }
    deactivateServiceType = async ({ whereClause, options }) => {
        await this.checkForDefaultModel()

        return this.serviceTypeRepository.deactivate({ whereClause, options })
    }
    updateServiceType = async ({ data, whereClause, options }) => {
        await this.checkForDefaultModel()

        return this.serviceTypeRepository.update({ data, whereClause, options })
    }

    addNewServiceType = async (data) => {
        await this.checkForDefaultModel()

        let { service_name } = data
        // checking service type exists or not
        const serviceTypeExists = await this.findOneServiceType({
            whereClause: {
                service_name: service_name,
                record_status: 1
            }
        })
        if (!serviceTypeExists) {
            // service not found
            let createdService = await this.createServiceType({ data })
            return resultObject(true, `Created service successfully`, {
                result: createdService
            }, HTTP_CODES.CREATED)
        }
        return resultObject(false, `Another similar service already exists`, {

        }, HTTP_CODES.CONFLICT)

    }
}


module.exports = new ServiceTypeService()
