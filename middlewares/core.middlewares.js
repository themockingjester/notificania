const { HTTP_CODES } = require("../src/constants/httpCodes.constant");
const { exportedDIContainer } = require("../src/exportedDiContainer");
const { generateResponse } = require("../src/utils/common.utils");

function requestServeCheck(req, res, next) {
  if (!exportedDIContainer.config.SERVER.SHOULD_SERVE_CLIENT_REQUESTS) {
    return res
      .status(HTTP_CODES.SERVICE_UNAVILABLE)
      .send(
        generateResponse(
          true,
          `Client Serving mode is disabled`,
          {},
          HTTP_CODES.SERVICE_UNAVILABLE
        )
      );
  }
  next();
}

module.exports = {
  requestServeCheck,
};
