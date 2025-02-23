const { logger } = require("../di-container");
const { exportedDIContainer } = require("../exportedDiContainer");

// Handle graceful shutdown
const gracefulShutdown = async () => {
  try {
    logger.info(`Shutting down server`);
    console.log("\nShutting down gracefully...");

    // disconnecting database
    await disConnectDatabase();

    // disconnecting kafka
    await disConnectKafka();

    // disconnect redis
    await disConnectRedis();

    // disconnect apache cassandra
    await disConnectApacheCassandra();

    logger.info(`Server shutdown successfully completed.`);

    process.exit(0);
  } catch (error) {
    logger.error(`Error while Shutting down server error: ${error.message}`, {
      error: error.message,
      stack: error.stack,
    });

    console.error("Error while shutting down server:", error);
    process.exit(1);
  }
};

disConnectDatabase = async () => {
  if (exportedDIContainer.databaseHandler) {
    await exportedDIContainer.databaseHandlerObject.disconnect();
  }
};

async function disConnectKafka() {
  if (
    exportedDIContainer.messageChannels.kafka.producer ||
    exportedDIContainer.messageChannels.kafka.consumer
  ) {
    await exportedDIContainer.messageChannels.kafka.producer.disconnect({
      disconnectProducer: true,
      disconnectConsumer: true,
    }); // we can use anyone to disconnect either producer or consumer
  }
}

async function disConnectRedis() {
  if (exportedDIContainer.caching.redis.connector) {
    await exportedDIContainer.caching.redis.connector.disconnect();
  }
}
async function disConnectApacheCassandra() {
  if (exportedDIContainer.dataWareHouse.apacheCassandra.connector) {
    await exportedDIContainer.dataWareHouse.apacheCassandra.connector.disconnect();
  }
}

module.exports = {
  gracefulShutdown,
};
