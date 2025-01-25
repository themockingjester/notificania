const express = require("express");
const config = require('../config.json')
const createRoutes = require('./routes'); // Import the route function

const app = express();
const { serverConfiguration } = require("./server_setup/config");
const { logger } = require("./di-container");

const PORT = config.SERVER.PORT || 4094
app.use(express.json()); // for parsing application/json

async function startServer() {
    await serverConfiguration({})
    // Base route handler 

    app.use("/apis", createRoutes());

    app.listen(PORT, () => {
        logger.info(`Server is running on ${PORT} 🚀`)
    });

}
startServer()