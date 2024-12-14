// this file is to fullfill the purpose of dependency injection
const config = require("../config.json")

const DI_CONTAINER = {
    config: config,
    databaseHandler: null,
    dbModels: null
};
module.exports = DI_CONTAINER