const config = require("../../config.json");
const { SERVER_SETUP_CONSTANTS } = require("../constants/serverSetup.constant");
const { exportedDIContainer } = require("../exportedDiContainer");
const loadModels = require('../models');

const { DatabaseFactory } = require("../utils/database/databaseFactory");
const serverConfiguration = async ({

}) => {
    return new Promise(async (resolve, reject) => {
        try {
            // connect to database
            const selectedDatabase = config.DATABASE.DEFAULT
            if (!config.DATABASE[selectedDatabase]) {
                throw new Error(SERVER_SETUP_CONSTANTS.ERROR_MESSAGES.UNABLE_TO_IDENTIFY_CORRECT_DATABASE_FROM_CONFIG)

            }

            const myDatabase = await DatabaseFactory(selectedDatabase)
            await myDatabase.connect()
            exportedDIContainer.databaseHandler = await myDatabase.getConnection()


            // Load models
            const models = await loadModels(exportedDIContainer.databaseHandler);
            exportedDIContainer.dbModels = models
            await exportedDIContainer.databaseHandler.sync({

            });

            console.log('Database setup done! 🎉');
            resolve()
        } catch (error) {
            console.log('SERVER SETUP FAILED error: ' + error)
            reject()
        }
    })
}

module.exports = {
    serverConfiguration
}