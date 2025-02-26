const NotificationEventRepository = require("../repositories/notificationEvent.repository");

const { Op } = require("sequelize");

const { resultObject } = require("../utils/common.utils");
const { HTTP_CODES } = require("../constants/httpCodes.constant");
const { exportedDIContainer } = require("../exportedDiContainer");
const { DATABASE_CONSTANTS } = require("../constants/database.constant");

class NotificationEventService {
  notificationEventRepository;
  isDefaultDbModelSet = false;
  constructor() {
    this.notificationEventRepository = new NotificationEventRepository();
  }
  intiateDefaultRepository() {
    this.notificationEventRepository.setModel(
      exportedDIContainer.dbModels[DATABASE_CONSTANTS.TABLES.NOTIFICATION_EVENT]
    );
  }
  async checkForDefaultModel() {
    if (!this.isDefaultDbModelSet) {
      await this.intiateDefaultRepository();
      this.isDefaultDbModelSet = true;
    }
  }
  findOneNotificationEventCore = async ({ whereClause, include }) => {
    await this.checkForDefaultModel();
    return this.notificationEventRepository.findOne({ whereClause, include });
  };

  findAllNotificationEventCore = async ({ whereClause, include }) => {
    await this.checkForDefaultModel();

    return this.notificationEventRepository.findAll({ whereClause, include });
  };
  createNotificationEventCore = async ({ data, options }) => {
    await this.checkForDefaultModel();

    return this.notificationEventRepository.create({ data, options });
  };
  createNotificationEventCoreBulkCreate = async ({ data, options }) => {
    await this.checkForDefaultModel();

    return this.notificationEventRepository.bulkCreate({
      dataArray: data,
      options,
    });
  };
  deactivateNotificationEventCore = async ({ whereClause, options }) => {
    await this.checkForDefaultModel();

    return this.notificationEventRepository.deactivate({
      whereClause,
      options,
    });
  };
  updateNotificationEventCore = async ({ data, whereClause, options }) => {
    await this.checkForDefaultModel();

    return this.notificationEventRepository.update({
      data,
      whereClause,
      options,
    });
  };

  addNewNotificationEvent = async (data) => {
    await this.checkForDefaultModel();

    let { event_name, service_id } = data;

    // checking notification event exists or not
    const notificationEventExists = await this.findOneNotificationEventCore({
      whereClause: {
        service_id: service_id,
        event_name: event_name,
        record_status: 1,
      },
    });
    if (!notificationEventExists) {
      // notification event not found
      let createdEvent = await this.createNotificationEventCore({ data });
      return resultObject(
        true,
        `Created notification event successfully`,
        {
          result: createdEvent,
        },
        HTTP_CODES.CREATED
      );
    }
    return resultObject(
      false,
      `Another similar notification event already exists`,
      {},
      HTTP_CODES.CONFLICT
    );
  };

  updateExistingNotificationEvent = async (data, notificationEventId) => {
    await this.checkForDefaultModel();

    let { event_name } = data;

    if (!event_name) {
      return resultObject(
        false,
        `event name is missing`,
        {},
        HTTP_CODES.BAD_REQUEST
      );
    }
    // fetching notification event
    const fetchedNotificationEventData =
      await this.findOneNotificationEventCore({
        whereClause: {
          id: notificationEventId,
        },
      });
    if (!fetchedNotificationEventData) {
      return resultObject(
        false,
        `Notification event not found`,
        {},
        HTTP_CODES.NOT_FOUND
      );
    }
    // checking similar event exists or not
    const notificationEventExists = await this.findOneNotificationEventCore({
      whereClause: {
        event_name: event_name,
        service_id: fetchedNotificationEventData.service_id,
        id: {
          [Op.notIn]: [notificationEventId],
        },
      },
    });
    if (notificationEventExists) {
      // similar service found
      return resultObject(
        false,
        `Similar notification event already exists`,
        {},
        HTTP_CODES.CONFLICT
      );
    }

    // update the service config
    let updatedNotificationEvent = await this.updateNotificationEventCore({
      data: {
        ...data,
      },
      whereClause: {
        id: notificationEventId,
      },
    });
    return resultObject(
      true,
      `Updated notification event successfully`,
      {
        result: updatedNotificationEvent,
      },
      HTTP_CODES.OK
    );
  };

  findAllNotificationEvents = async () => {
    await this.checkForDefaultModel();

    const allNotificationEvents = await this.findAllNotificationEventCore({
      whereClause: {
        record_status: 1,
      },
      include: [
        {
          model:
            exportedDIContainer.dbModels[
              DATABASE_CONSTANTS.TABLES.SERVICE_TYPE
            ],
        },
      ],
    });

    return resultObject(
      true,
      `Fetched notification events`,
      {
        result: allNotificationEvents,
      },
      HTTP_CODES.OK
    );
  };

  findSpecificNotificationEvent = async (notificationEventId) => {
    await this.checkForDefaultModel();

    const notificationEventData = await this.findOneNotificationEventCore({
      whereClause: {
        id: notificationEventId,
        record_status: 1,
      },
      include: {
        model:
          exportedDIContainer.dbModels[DATABASE_CONSTANTS.TABLES.SERVICE_TYPE],
      },
    });

    return resultObject(
      true,
      `Fetched notification event`,
      {
        result: notificationEventData,
      },
      HTTP_CODES.OK
    );
  };
}

module.exports = new NotificationEventService();
