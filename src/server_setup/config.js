const config = require("../../config.json");
const { SERVER_SETUP_CONSTANTS } = require("../constants/serverSetup.constant");
const loadModels = require('../models');

const { DatabaseFactory } = require("../utils/database/databaseFactory");
const serverConfiguration = async ({
    diContainer
}) => {
    try {

        // connect to database
        const selectedDatabase = config.DATABASE.DEFAULT
        if (!config.DATABASE[selectedDatabase]) {
            throw new Error(SERVER_SETUP_CONSTANTS.ERROR_MESSAGES.UNABLE_TO_IDENTIFY_CORRECT_DATABASE_FROM_CONFIG)

        }

        const myDatabase = await DatabaseFactory(selectedDatabase)
        await myDatabase.connect()
        diContainer.databaseHandler = await myDatabase.getConnection()


        // Load models
        const models = loadModels(diContainer.databaseHandler);
        diContainer.dbModels = models
        await diContainer.databaseHandler.sync();

        console.log('Database setup done!', models['service_type']);

    } catch (error) {
        console.log('SERVER SETUP FAILED error: ' + error)

    }
}

module.exports = {
    serverConfiguration
}