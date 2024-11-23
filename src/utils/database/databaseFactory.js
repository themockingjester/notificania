const { SERVER_SETUP_CONSTANTS } = require("../../constants/serverSetup.constant")
const mySqlDatabase = require("./mysql/database")
const DatabaseFactory = (databaseName) => {
    if (databaseName == 'MYSQL') {
        return mySqlDatabase
    } else {
        throw new Error(SERVER_SETUP_CONSTANTS.ERROR_MESSAGES.UNKNOWN_DATABASE_REQUESTED)
    }
}

module.exports = {
    DatabaseFactory
}