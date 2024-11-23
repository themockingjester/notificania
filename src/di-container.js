// this file is to fullfill the purpose of dependency injection
const config = require("../config.json")
module.exports = {
    DI_CONTAINER: {
        config: config,
        databaseHandler: null,
        dbModels: null
    }
}