const { logger } = require("../di-container");
const { exportedDIContainer } = require("../exportedDiContainer");
const gracefulShutdown = (server) => {
  exportedDIContainer.SHUTTING_DOWN = true;
  server.close(async () => {
    console.log("Closed all connections.");

    await stopKafkaForFetchingFurtherMessages();
    // Wait for ongoing tasks to finish
    await waitForTasks();
    await lastTimeCleanup();
    process.exit(0);
  });

  setTimeout(async () => {
    console.error("Forcing shutdown.");

    await stopKafkaForFetchingFurtherMessages();
    // Wait for ongoing tasks to finish
    await waitForTasks();
    await lastTimeCleanup();

    process.exit(1);
  }, 10000);
};

async function stopKafkaForFetchingFurtherMessages() {
  if (exportedDIContainer.messageChannels.kafka.consumer) {
    console.log("Pausing Kafka consumer");
    // Pausing Kafka consumer
    await exportedDIContainer.messageChannels.kafka.consumer.consumer.consumer.pause(
      [{ topic: "*" }]
    );
  }
}
// Handle graceful shutdown
const lastTimeCleanup = async () => {
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
  } catch (error) {
    logger.error(`Error while Shutting down server error: ${error.message}`, {
      error: error.message,
      stack: error.stack,
    });

    console.error("Error while shutting down server:", error);
  }
};

disConnectDatabase = async () => {
  if (exportedDIContainer.databaseHandler) {
    await exportedDIContainer.databaseHandlerObject.disconnect();
  }
};

let isShutdownInProgress = false;
const waitForTasks = async () => {
  if (isShutdownInProgress) return;
  isShutdownInProgress = true;
  console.log("Waiting for ongoing tasks to complete...");

  while (exportedDIContainer.ONGOING_TASKS > 0) {
    console.log(`Ongoing tasks: ${exportedDIContainer.ONGOING_TASKS}`);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 500ms
  }

  logger.info("All ongoing tasks completed.");
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
