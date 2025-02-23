const config = require("../../../../config.json");
const Sequelize = require("sequelize");
const AbstractDatabaseClass = require("../abstractDatabase");
const { DATABASE_CONSTANTS } = require("../../../constants/database.constant");
const { logger } = require("../../../di-container");

class MySqlDatabase extends AbstractDatabaseClass {
  sequelize;
  isThisDBEnabled = false;
  constructor() {
    super();
    // if mysql is enabled
    if (config.DATABASE.MYSQL.ENABLED) {
      this.isThisDBEnabled = true;

      // creating connection to database
      this.sequelize = new Sequelize(
        config.DATABASE.MYSQL.DATABASE_NAME,
        config.DATABASE.MYSQL.USER_NAME,
        config.DATABASE.MYSQL.PASSWORD,
        {
          host: config.DATABASE.MYSQL.HOST,
          dialect: "mysql",
        }
      );
    }
  }

  /** connects to mysql database */
  async connect() {
    // checking if the database is enabled
    if (this.isThisDBEnabled) {
      await this.sequelize.authenticate();
      // await this.sequelize.query(`CREATE DATABASE IF NOT EXISTS ${config.DATABASE.MYSQL.DATABASE_NAME};`);
      // await this.sequelize.query(`USE ${config.DATABASE.MYSQL.DATABASE_NAME};`);
      // successfully got connected
    } else {
      throw new Error(
        DATABASE_CONSTANTS.ERROR_MESSAGES.REQUESTED_DATABASE_IS_NOT_ENABLED_IN_CONFIG
      );
    }
  }

  /** Disconnects from mysql database */
  async disconnect() {
    if (this.isThisDBEnabled && this.sequelize) {
      try {
        await this.sequelize.close();
        logger.info(`Successfully disconnected from MySQL database`);
      } catch (error) {
        logger.error(
          `Error while disconnecting from MySQL database: ${error.message}`,
          {
            error: error.message,
            stack: error.stack,
          }
        );
        throw error;
      }
    }
  }

  /** returns the mysql connection object */
  getConnection() {
    return this.sequelize;
  }
}

module.exports = new MySqlDatabase();
