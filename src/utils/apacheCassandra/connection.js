const cassandra = require("cassandra-driver");

const { logger } = require("../../di-container");
const { exportedDIContainer } = require("../../exportedDiContainer");
class ApacheCassandraConnection {
  apacheCassandraClient;
  async initialize() {
    if (
      exportedDIContainer.config.DATA_WAREHOUSE.ENABLED &&
      exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA.ENABLED
    ) {
      const authProvider = new cassandra.auth.PlainTextAuthProvider(
        exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA.USER_NAME,
        exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA.PASSWORD
      );
      const client = new cassandra.Client({
        contactPoints: [
          ...exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA
            .CONTACT_POINTS,
        ],
        localDataCenter:
          exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA
            .LOCAL_DATA_CENTER,
        keyspace:
          exportedDIContainer.config.DATA_WAREHOUSE.APACHE_CASSANDRA.KEYSPACE,
        authProvider: authProvider,
      });
      this.apacheCassandraClient = client;
      logger.info("Apache Cassandra connection established 🚀");
    } else {
      logger.error(`Apache Cassandra is not enabled ❌`);
    }
  }
  disconnect() {
    //TODO
    // Will implement connection disconnection logic
  }
}

module.exports = new ApacheCassandraConnection();
