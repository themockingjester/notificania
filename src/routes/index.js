const router = require("express").Router();
const system = require("./system")
const service = require("./service")


module.exports = () => {

    // system route
    router.use("/system", system)


    // service route
    router.use("/service", service)
    return router;
};