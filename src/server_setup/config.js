const config = require("../../config.json");
const { SERVER_SETUP_CONSTANTS } = require("../constants/serverSetup.constant");
const { exportedDIContainer } = require("../exportedDiContainer");
const { setupMessageListerners } = require("../message_channel");
const redisConnector = require('../utils/redis/connection')
const loadModels = require('../models');
const BaseCommunicationChannel = require("../utils/communicationStrategies");
const KafkaCommunicationStrategy = require("../utils/communicationStrategies/kafkaCommunicationStrategy");
const redisHelperFunctions = require("../utils/redis/helperFunctions")
const { DatabaseFactory } = require("../utils/database/databaseFactory");
const { getCachingStrategy } = require("../utils/cachingStrategies");
const { logger } = require("../di-container");

const setupKafka = async () => {
    const kafkaChannel = await new BaseCommunicationChannel().getChannel(KafkaCommunicationStrategy)
    await kafkaChannel.initialize()
    exportedDIContainer.messageChannels.kafka.producer = kafkaChannel
    exportedDIContainer.messageChannels.kafka.consumer = kafkaChannel
    logger.info(`Setup of kafka done 🚀!`)

}

async function setupRedis() {


    // Setting up redis connection
    const redisConnection = redisConnector
    await redisConnection.initialize()
    const redisClient = redisConnection.redisClient
    if (redisClient) {
        exportedDIContainer.caching.redis.client = redisClient
        await redisHelperFunctions.initClient()
        logger.info(`Setup of Redis done! 🚀`)

    }
}

async function setupCachingStrategy() {

    // Setting up caching strategy
    const cachingStrategy = await getCachingStrategy()
    exportedDIContainer.caching.strategy = cachingStrategy
    logger.info(`Caching Strategy setup correctly! 🚀`)

}
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
            logger.info(`Setup of database done! 🚀`)


            // Load models
            const models = await loadModels(exportedDIContainer.databaseHandler);
            exportedDIContainer.dbModels = models
            logger.info(`DB models loaded successfully 🚀!`)

            await exportedDIContainer.databaseHandler.sync({

            });
            if (config.SERVER.MESSAGING_CHANNELS.APACHE_KAFKA.ENABLED) {
                try {
                    await setupKafka()
                } catch (error) {
                    throw error
                }

            }


            // Setting up messaging channels listeners
            try {
                await setupMessageListerners()
                logger.info(`Message channel listeners setup correctly 🚀!`)
            } catch (error) {

                throw error
            }

            // Setting up Redis cache
            try {
                await setupRedis()
            } catch (error) {
                throw error
            }

            // setting up caching strategy
            try {
                await setupCachingStrategy()
            }
            catch (error) {
                throw error
            }
            resolve()
        } catch (error) {
            logger.error(`Failed to setup server configuration error: ${error.message}`, {
                error: error.message,
                stack: error.stack
            })
            reject()
        }
    })
}

module.exports = {
    serverConfiguration
}