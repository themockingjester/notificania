const config = require("../../../../config.json")
const Sequelize = require("sequelize");
const AbstractDatabaseClass = require("../abstractDatabase");
const { DATABASE_CONSTANTS } = require("../../../constants/database.constant");


class MySqlDatabase extends AbstractDatabaseClass {
    sequelize
    isThisDBEnabled = false;
    constructor() {
        super()
        // if mysql is enabled
        if (config.DATABASE.MYSQL.ENABLED) {
            this.isThisDBEnabled = true;

            // creating connection to database
            this.sequelize = new Sequelize(
                '',
                config.DATABASE.MYSQL.USER_NAME,
                config.DATABASE.MYSQL.PASSWORD,
                {
                    host: config.DATABASE.MYSQL.HOST,
                    dialect: 'mysql'
                }
            );


        }

    }

    /** connects to mysql database */
    async connect() {
        // checking if the database is enabled
        if (this.isThisDBEnabled) {
            await this.sequelize.authenticate()
            await this.sequelize.query(`CREATE DATABASE IF NOT EXISTS ${config.DATABASE.MYSQL.DATABASE_NAME};`);
            await this.sequelize.query(`USE ${config.DATABASE.MYSQL.DATABASE_NAME};`);

            // successfully got connected
        } else {
            throw new Error(DATABASE_CONSTANTS.ERROR_MESSAGES.REQUESTED_DATABASE_IS_NOT_ENABLED_IN_CONFIG)
        }
    }

    /** Disconnects from mysql database */
    async disconnect() {
        // TODO: implement later
    }


    /** returns the mysql connection object */
    getConnection() {
        return this.sequelize
    }
}

module.exports = new MySqlDatabase()