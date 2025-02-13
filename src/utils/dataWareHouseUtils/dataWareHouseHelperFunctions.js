const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../../constants/apacheCassandra.constant");
const { logger } = require("../../di-container");
const { exportedDIContainer } = require("../../exportedDiContainer");
const { generateUUIDV4 } = require("../common.utils");

class DataWareHouseHelperFunctions {
  async insertToWareHouseNotificationDetailedLogs(data) {
    if (!exportedDIContainer.config.DATA_WAREHOUSE.ENABLED) {
      return;
    }
    let id = generateUUIDV4();
    let { message_id, input_data, output_data, process_status } = data;
    if (exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA.ENABLED) {
      // Apache Cassandra Enabled
      return await exportedDIContainer.dataWareHouse.strategy.insertOne({
        apacheCassandra: {
          query: `INSERT INTO ${exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA.KEYSPACE}.${APACHE_CASSANDRA_CONSTANTS.TABLES.NOTIFICATION_DETAILED_LOGS}  (message_id, input_data, output_data,created_at,id,process_status) VALUES (?, ?, ?,?,?,?)`,
          parameters: [
            message_id,
            input_data,
            output_data,
            new Date(),
            id,
            process_status,
          ],
        },
      });
    } else {
      logger.error(
        `Tried to add to ware house but unable to autodetect warehouse`
      );
    }
  }
}

module.exports = new DataWareHouseHelperFunctions();
