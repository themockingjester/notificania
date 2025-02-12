const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../../constants/apacheCassandra.constant");
const { exportedDIContainer } = require("../../exportedDiContainer");

module.exports = {
  APACHE_CASSANDRA_INITIAL_SETUP_QUERIES: {
    NOTIFICATION_DETAILED_LOGS_TABLE: `CREATE TABLE IF NOT EXISTS ${exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA.KEYSPACE}.${APACHE_CASSANDRA_CONSTANTS.TABLES.NOTIFICATION_DETAILED_LOGS} (
    message_id UUID,
    id UUID,
    input_data TEXT,
    output_data TEXT,
    created_at TIMESTAMP,
    process_status TEXT,
    PRIMARY KEY (message_id, created_at, id)
) WITH CLUSTERING ORDER BY (created_at DESC);
`,
  },
};
