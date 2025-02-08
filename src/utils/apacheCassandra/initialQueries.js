const { exportedDIContainer } = require("../../exportedDiContainer");

module.exports = {
  APACHE_CASSANDRA_INITIAL_SETUP_QUERIES: {
    NOTIFICATION_DETAILED_LOGS_TABLE: `CREATE TABLE IF NOT EXISTS ${exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA.KEYSPACE}.notification_detailed_logs (
    message_id UUID,
    id UUID,
    inputData TEXT,
    outputData TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (message_id, created_at, id)
) WITH CLUSTERING ORDER BY (created_at DESC);
`,
  },
};
