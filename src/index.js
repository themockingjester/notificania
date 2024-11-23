const express = require("express");
const config = require('../config.json')
const diContainer = require("./di-container")
const createRoutes = require('./routes'); // Import the route function

const app = express();
const { serverConfiguration } = require("./server_setup/config")

const PORT = config.SERVER.PORT || 4094
app.use(express.json()); // for parsing application/json

serverConfiguration({ diContainer: diContainer })
// Base route handler 
app.use("/apis", createRoutes(diContainer));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
