const express = require("express");
const config = require("../config.json");
const createRoutes = require("./routes"); // Import the route function

const app = express();
const { serverConfiguration } = require("./server_setup/config");
const { logger } = require("./di-container");
const {
  gracefulShutdown,
} = require("./server_setup/server_termination_configuration");

const PORT = config.SERVER.PORT || 4094;
app.use(express.json()); // for parsing application/json

async function startServer() {
  await serverConfiguration({});
  // Base route handler

  app.use("/apis", createRoutes());

  const server = app.listen(PORT, () => {
    logger.info(`Server is running on ${PORT} 🚀`);
  });

  // Handle unexpected errors
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    gracefulShutdown(server);
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    gracefulShutdown(server);
  });

  // Listen for termination signals
  process.on("SIGINT", () => gracefulShutdown(server));
  process.on("SIGTERM", () => gracefulShutdown(server));
}
startServer();
