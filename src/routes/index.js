const router = require("express").Router();
const system = require("./system")



module.exports = (diContainer) => {
    const { config, database } = diContainer;

    // system route
    router.use("/system", system)

    // Add more routes here, and use `diContainer` as needed

    return router;
};