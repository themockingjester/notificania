const NotificationTrackRepository = require("../repositories/notificationTrack.repository")
const { Op } = require("sequelize");

const { resultObject } = require("../utils/common.utils")
const { HTTP_CODES } = require("../constants/httpCodes.constant")
const { exportedDIContainer } = require("../exportedDiContainer");
const { DATABASE_CONSTANTS } = require("../constants/database.constant");

class NotificationTrackerService {
    NotificationTrackRepository
    isDefaultDbModelSet = false
    constructor() {
        this.NotificationTrackRepository = new NotificationTrackRepository()
    }
    intiateDefaultRepository() {
        this.NotificationTrackRepository.setModel(exportedDIContainer.dbModels[DATABASE_CONSTANTS.TABLES.NOTIFICATION_TRACK])
    }
    async checkForDefaultModel() {
        if (!this.isDefaultDbModelSet) {
            await this.intiateDefaultRepository()
            this.isDefaultDbModelSet = true
        }
    }
    findOneNotificationTrackerCore = async ({ whereClause, include }) => {
        await this.checkForDefaultModel()
        return this.NotificationTrackRepository.findOne({ whereClause, include })
    }

    findAllNotificationTrackerCore = async ({ whereClause, include }) => {
        await this.checkForDefaultModel()

        return this.NotificationTrackRepository.findAll({ whereClause, include })
    }
    createNotificationTrackerCore = async ({ data, options }) => {
        await this.checkForDefaultModel()

        return this.NotificationTrackRepository.create({ data, options })
    }
    deactivateNotificationTrackerCore = async ({ whereClause, options }) => {
        await this.checkForDefaultModel()

        return this.NotificationTrackRepository.deactivate({ whereClause, options })
    }
    updateNotificationTrackerCore = async ({ data, whereClause, options }) => {
        await this.checkForDefaultModel()

        return this.NotificationTrackRepository.update({ data, whereClause, options })
    }

    addNewNotificationTracker = async (receivedData) => {
        await this.checkForDefaultModel()
        let createdTracker = await this.createNotificationTrackerCore({ data: receivedData })
        return resultObject(true, `Created notification tracker successfully`, {
            result: createdTracker
        }, HTTP_CODES.CREATED)


    }
    findAllNotificationTrackers = async ({ whereClause = {} }) => {
        await this.checkForDefaultModel()
        const allTrackers = await this.findAllNotificationTrackerCore({
            whereClause: {
                record_status: 1,
                ...whereClause
            }
        })

        return resultObject(true, `Fetched notification trackers`, {
            result: allTrackers
        }, HTTP_CODES.OK)

    }

    findSpecificNotificationTracker = async (id) => {
        await this.checkForDefaultModel()

        const trackerData = await this.findOneNotificationTrackerCore({
            whereClause: {
                id: id,
                record_status: 1
            },
            include: {
                model: exportedDIContainer.dbModels[DATABASE_CONSTANTS.TABLES.NOTIFICATION_EVENT]
            }
        })
        return resultObject(true, `Fetched notification tracker data`, {
            result: trackerData
        }, HTTP_CODES.OK)

    }
}


module.exports = new NotificationTrackerService()
