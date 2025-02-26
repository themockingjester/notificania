const ServiceTypeRepository = require("../repositories/serviceType.repository");
const { Op } = require("sequelize");

const { resultObject } = require("../utils/common.utils");
const { HTTP_CODES } = require("../constants/httpCodes.constant");
const { exportedDIContainer } = require("../exportedDiContainer");
const { DATABASE_CONSTANTS } = require("../constants/database.constant");

class ServiceTypeService {
  serviceTypeRepository;
  isDefaultDbModelSet = false;
  constructor() {
    this.serviceTypeRepository = new ServiceTypeRepository();
  }
  intiateDefaultRepository() {
    this.serviceTypeRepository.setModel(
      exportedDIContainer.dbModels["service_type"]
    );
  }
  async checkForDefaultModel() {
    if (!this.isDefaultDbModelSet) {
      await this.intiateDefaultRepository();
      this.isDefaultDbModelSet = true;
    }
  }
  findOneServiceTypeCore = async ({ whereClause, include }) => {
    await this.checkForDefaultModel();
    return this.serviceTypeRepository.findOne({ whereClause, include });
  };

  findAllServiceTypesCore = async ({ whereClause, include }) => {
    await this.checkForDefaultModel();

    return this.serviceTypeRepository.findAll({ whereClause, include });
  };
  createServiceTypeCore = async ({ data, options }) => {
    await this.checkForDefaultModel();

    return this.serviceTypeRepository.create({ data, options });
  };
  createServiceTypeCoreBulkCreate = async ({ data, options }) => {
    await this.checkForDefaultModel();

    return this.serviceTypeRepository.bulkCreate({ dataArray: data, options });
  };
  deactivateServiceTypeCore = async ({ whereClause, options }) => {
    await this.checkForDefaultModel();

    return this.serviceTypeRepository.deactivate({ whereClause, options });
  };
  updateServiceTypeCore = async ({ data, whereClause, options }) => {
    await this.checkForDefaultModel();

    return this.serviceTypeRepository.update({ data, whereClause, options });
  };

  addNewServiceType = async (data) => {
    await this.checkForDefaultModel();

    let { service_name } = data;
    // checking service type exists or not
    const serviceTypeExists = await this.findOneServiceTypeCore({
      whereClause: {
        service_name: service_name,
        record_status: 1,
      },
    });
    if (!serviceTypeExists) {
      // service not found
      let createdService = await this.createServiceTypeCore({ data });
      return resultObject(
        true,
        `Created service successfully`,
        {
          result: createdService,
        },
        HTTP_CODES.CREATED
      );
    }
    return resultObject(
      false,
      `Another similar service already exists`,
      {},
      HTTP_CODES.CONFLICT
    );
  };

  updateExistingServiceType = async (data, serviceId) => {
    await this.checkForDefaultModel();

    let { service_name } = data;

    // checking service type exists or not
    const serviceTypeExists = await this.findOneServiceTypeCore({
      whereClause: {
        service_name: service_name,
        id: {
          [Op.notIn]: [serviceId],
        },
      },
    });
    if (serviceTypeExists) {
      // similar service found
      return resultObject(
        false,
        `Similar Service already exists`,
        {},
        HTTP_CODES.CONFLICT
      );
    }

    // update the service
    let updatedService = await this.updateServiceTypeCore({
      data: {
        service_name: service_name,
      },
      whereClause: {
        id: serviceId,
      },
    });
    return resultObject(
      true,
      `Updated service successfully`,
      {
        result: updatedService,
      },
      HTTP_CODES.OK
    );
  };

  findAllServices = async () => {
    await this.checkForDefaultModel();
    const allServices = await this.findAllServiceTypesCore({
      whereClause: {
        record_status: 1,
      },
      include: [
        {
          model:
            exportedDIContainer.dbModels[
              DATABASE_CONSTANTS.TABLES.SERVICE_CONFIG
            ],
        },
      ],
    });
    return resultObject(
      true,
      `Fetched services`,
      {
        result: allServices,
      },
      HTTP_CODES.OK
    );
  };

  findSpecificService = async (serviceId) => {
    await this.checkForDefaultModel();

    const serviceData = await this.findOneServiceTypeCore({
      whereClause: {
        id: serviceId,
        record_status: 1,
      },
      include: [
        {
          model:
            exportedDIContainer.dbModels[
              DATABASE_CONSTANTS.TABLES.SERVICE_CONFIG
            ],
        },
      ],
    });

    return resultObject(
      true,
      `Fetched service`,
      {
        result: serviceData,
      },
      HTTP_CODES.OK
    );
  };
}

module.exports = new ServiceTypeService();
