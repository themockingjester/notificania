const router = require("express").Router();
const system = require("./system")
const service = require("./service")
const serviceConfig = require("./serviceConfig")

module.exports = () => {

    // system route
    router.use("/system", system)


    // service route
    router.use("/service", service)

    // service route
    router.use("/service-config", serviceConfig)
    return router;
};