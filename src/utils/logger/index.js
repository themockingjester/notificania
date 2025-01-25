const winston = require("winston");
const config = require("../../../config.json");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: config.APP_DETAILS.LOG_FILE }),
        new winston.transports.Console()
    ],
});

module.exports = {
    logger
}