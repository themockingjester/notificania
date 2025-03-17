const router = require("express").Router();
const system = require("./system");
const service = require("./service");
const serviceConfig = require("./serviceConfig");
const notificationEvent = require("./notificationEvent");
const channel = require("./channel");
const { requestServeCheck } = require("../../middlewares/core.middlewares");

module.exports = () => {
  // system route
  router.use("/system", system);

  // service route
  router.use("/service", requestServeCheck, service);

  // service route
  router.use("/service-config", requestServeCheck, serviceConfig);

  // notification event
  router.use("/notification-event", requestServeCheck, notificationEvent);

  // channel route
  router.use("/channel", requestServeCheck, channel);

  return router;
};
