const {
  SERVER_SETUP_CONSTANTS,
} = require("../../constants/serverSetup.constant");
const { config } = require("../../di-container");
const ApacheCassandraDataWareHouseStrategy = require("./apacheCassandraDataWareHouseStrategy");

async function getDataWareHousingStrategy() {
  if (config.DATA_WAREHOUSE.APACHE_CASSANDRA.ENABLED) {
    return new ApacheCassandraDataWareHouseStrategy();
  } else {
    throw new Error(
      SERVER_SETUP_CONSTANTS.ERROR_MESSAGES.UNABLE_TO_FIND_CORRECT_DATA_WARE_HOUSING_STRATEGY
    );
  }
}

module.exports = {
  getDataWareHousingStrategy,
};
