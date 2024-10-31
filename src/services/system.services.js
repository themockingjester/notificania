const { HTTP_CODES } = require("../constants/httpCodes.constant");
const { generateResponse } = require("../utils/common.utils");

function getSystemStatus(req, res) {
    return res.status(HTTP_CODES.OK).send(generateResponse(true, `Server is up and running`, {}, HTTP_CODES.OK))
}

module.exports = {
    getSystemStatus
}