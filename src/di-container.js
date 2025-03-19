// this file is to fullfill the purpose of dependency injection
const config = require("../config.json");
const { logger } = require("./utils/logger");
const DI_CONTAINER = {
  ONGOING_TASKS: 0,
  SHUTTING_DOWN: false,
  config: config,
  databaseHandler: null,
  databaseHandlerObject: null,
  dbModels: null,
  logger: logger,
  messageChannels: {
    kafka: {
      producer: null,
      consumer: null,
    },
  },
  caching: {
    redis: {
      client: null,
      connector: null,
    },
    strategy: null,
  },
  dataWareHouse: {
    apacheCassandra: {
      client: null,
      connector: null,
    },
    strategy: null,
  },
};
module.exports = DI_CONTAINER;
