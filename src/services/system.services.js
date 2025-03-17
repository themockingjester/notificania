const { HTTP_CODES } = require("../constants/httpCodes.constant");
const { exportedDIContainer } = require("../exportedDiContainer");

const { generateResponse } = require("../utils/common.utils");

function getSystemStatus(req, res) {
  return res
    .status(HTTP_CODES.OK)
    .send(
      generateResponse(true, `Server is up and running`, {}, HTTP_CODES.OK)
    );
}

function revertClientRequestServingToogle(req, res) {
  exportedDIContainer.config.SERVER.SHOULD_SERVE_CLIENT_REQUESTS =
    !exportedDIContainer?.config?.SERVER.SHOULD_SERVE_CLIENT_REQUESTS;

  return res
    .status(HTTP_CODES.OK)
    .send(
      generateResponse(
        true,
        `Client request serving is now ${
          exportedDIContainer.config.SERVER.SHOULD_SERVE_CLIENT_REQUESTS
            ? "enabled"
            : "disabled"
        }`,
        {},
        HTTP_CODES.OK
      )
    );
}

module.exports = {
  getSystemStatus,
  revertClientRequestServingToogle,
};
