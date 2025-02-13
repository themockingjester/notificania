const { config } = require("../../di-container");
const apacheCassandraHelperFunction = require("./../apacheCassandra/apacheCassandraHelperFunctions");
const DataWareHouseStrategy = require("./dataWareHouseStrategy");

class ApacheCassandraDataWareHouseStrategy extends DataWareHouseStrategy {
  strategyType =
    config.DATA_WAREHOUSE.SUPPORTED_DATA_WAREHOUSES.APACHE_CASSANDRA;
  async insertOne(data) {
    let {
      apacheCassandra: { query, parameters },
    } = data;
    let savedData = await apacheCassandraHelperFunction.execute({
      query,
      parameters,
    });
    return savedData;
  }
  async findAll(data) {
    let {
      apacheCassandra: { query, parameters },
    } = data;
    let fetchedData = await apacheCassandraHelperFunction.execute({
      query,
      parameters,
    });
    return fetchedData;
  }
}
module.exports = ApacheCassandraDataWareHouseStrategy;
