const NotificationEventConfigRepository = require("../repositories/notificationEventConfig.repository")
const { Op } = require("sequelize");

const { resultObject } = require("../utils/common.utils")
const { HTTP_CODES } = require("../constants/httpCodes.constant")
const { exportedDIContainer } = require("../exportedDiContainer");
const { DATABASE_CONSTANTS } = require("../constants/database.constant");

class NotificationEventConfigService {
    NotificationEventConfigRepository
    isDefaultDbModelSet = false
    constructor() {
        this.NotificationEventConfigRepository = new NotificationEventConfigRepository()
    }
    intiateDefaultRepository() {
        this.NotificationEventConfigRepository.setModel(exportedDIContainer.dbModels[DATABASE_CONSTANTS.TABLES.NOTIFICATION_EVENT_CONFIG])
    }
    async checkForDefaultModel() {
        if (!this.isDefaultDbModelSet) {
            await this.intiateDefaultRepository()
            this.isDefaultDbModelSet = true
        }
    }
    findOneNotificationEventConfigCore = async ({ whereClause, include }) => {
        await this.checkForDefaultModel()
        return this.NotificationEventConfigRepository.findOne({ whereClause, include })
    }

    findAllNotificationEventConfigCore = async ({ whereClause, include }) => {
        await this.checkForDefaultModel()

        return this.NotificationEventConfigRepository.findAll({ whereClause, include })
    }
    createNotificationEventConfigCore = async ({ data, options }) => {
        await this.checkForDefaultModel()

        return this.NotificationEventConfigRepository.create({ data, options })
    }
    deactivateNotificationEventConfigCore = async ({ whereClause, options }) => {
        await this.checkForDefaultModel()

        return this.NotificationEventConfigRepository.deactivate({ whereClause, options })
    }
    updateNotificationEventConfigCore = async ({ data, whereClause, options }) => {
        await this.checkForDefaultModel()

        return this.NotificationEventConfigRepository.update({ data, whereClause, options })
    }

    addNewNotificationEventConfig = async (data) => {
        await this.checkForDefaultModel()

        let { key, event_id, value } = data
        // checking notification event config exists or not
        const notificationEventConfigExists = await this.findOneNotificationEventConfigCore({
            whereClause: {
                event_id: event_id,
                key: key,
                // record_status: 1
            }
        })
        if (!notificationEventConfigExists) {
            // notification event config not found
            let createdConfig = await this.createNotificationEventConfigCore({ data })
            return resultObject(true, `Created notification event config successfully`, {
                result: createdConfig
            }, HTTP_CODES.CREATED)
        }
        return resultObject(false, `Another similar notification event config already exists`, {

        }, HTTP_CODES.CONFLICT)

    }

    updateExistingNotificationEventConfig = async (data, notificationEventConfigId) => {
        await this.checkForDefaultModel()

        let { key } = data

        if (!key) {
            return resultObject(false, `key is missing`, {}, HTTP_CODES.BAD_REQUEST)
        }
        // fetching notification event config id
        const fetchedServiceConfigData = await this.findOneNotificationEventConfigCore({
            whereClause: {
                id: notificationEventConfigId
            }
        })
        if (!fetchedServiceConfigData) {
            return resultObject(false, `Service config not found`, {}, HTTP_CODES.NOT_FOUND)
        }
        // checking similar notification event config exists or not, duplicate never going to happen as we have unique constraint on event_id and key but let it be for safety
        const notificationEventConfigExists = await this.findOneNotificationEventConfigCore({
            whereClause: {
                key: key,
                event_id: fetchedServiceConfigData.event_id,
                id: {
                    [Op.notIn]: [notificationEventConfigId]
                }
            }
        })
        if (notificationEventConfigExists) {
            // similar notification event config found
            return resultObject(false, `Similar notification event config already exists`, {

            }, HTTP_CODES.CONFLICT)
        }

        // update the notification event config
        let updatedService = await this.updateNotificationEventConfigCore({
            data: {
                ...data
            },
            whereClause: {
                id: notificationEventConfigId
            }
        })
        return resultObject(true, `Updated notification event config successfully`, {
            result: updatedService
        }, HTTP_CODES.OK)

    }

    findAllNotificationEventConfigs = async ({ whereClause = {} }) => {
        await this.checkForDefaultModel()
        const allConfigs = await this.findAllNotificationEventConfigCore({
            whereClause: {
                record_status: 1,
                ...whereClause
            },
            include: [
                {
                    model: exportedDIContainer.dbModels[DATABASE_CONSTANTS.TABLES.NOTIFICATION_EVENT],
                }
            ]
        })

        return resultObject(true, `Fetched notification event configs`, {
            result: allConfigs
        }, HTTP_CODES.OK)

    }

    findSpecificNotificationEventConfig = async (notificationEventConfigId) => {
        await this.checkForDefaultModel()

        const configData = await this.findOneNotificationEventConfigCore({
            whereClause: {
                id: notificationEventConfigId,
                record_status: 1
            },
            include: {
                model: exportedDIContainer.dbModels[DATABASE_CONSTANTS.TABLES.NOTIFICATION_EVENT]
            }
        })

        return resultObject(true, `Fetched notification event config`, {
            result: configData
        }, HTTP_CODES.OK)

    }
}


module.exports = new NotificationEventConfigService()
