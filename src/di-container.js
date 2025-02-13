// this file is to fullfill the purpose of dependency injection
const config = require("../config.json");
const { logger } = require("./utils/logger");
const DI_CONTAINER = {
  config: config,
  databaseHandler: null,
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
    },
    strategy: null,
  },
  dataWareHouse: {
    apacheCassandra: {
      client: null,
    },
    strategy: null,
  },
};
module.exports = DI_CONTAINER;
