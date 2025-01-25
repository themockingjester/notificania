const router = require("express").Router();
const system = require("./system")
const service = require("./service")
const serviceConfig = require("./serviceConfig")
const notificationEvent = require("./notificationEvent")
const channel = require("./channel")


module.exports = () => {

    // system route
    router.use("/system", system)


    // service route
    router.use("/service", service)

    // service route
    router.use("/service-config", serviceConfig)

    // notification event
    router.use("/notification-event", notificationEvent)

    // channel route
    router.use("/channel", channel)


    return router;
};