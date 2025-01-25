class AbstractDatabaseClass {

    /** connects to database */
    async connect() { }

    /** disconnects from database */
    async disconnect() { }


    /** returns database connection */
    getConnection() { }
}

module.exports = AbstractDatabaseClass