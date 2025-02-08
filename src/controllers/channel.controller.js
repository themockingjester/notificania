const { HTTP_CODES } = require("../constants/httpCodes.constant");
const { SERVER_RESPONSES } = require("../constants/serverResponse.constant");
const { logger } = require("../di-container");
const ChannelService = require("../services/channel.services");
const { generateResponse } = require("../utils/common.utils");

const sendMessage = async (req, res) => {
  let { message } = req.body;
  try {
    let result = await ChannelService.sendMessage(message);
    return res
      .status(result.code)
      .send(
        generateResponse(
          result.success,
          result.message,
          result.data,
          result.code
        )
      );
  } catch (error) {
    logger.error(`Failed to send message error: ${error.message}`);
    return res
      .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
      .send(
        generateResponse(
          false,
          SERVER_RESPONSES.INTERNAL_SERVER_ERROR,
          { error: error.message },
          HTTP_CODES.INTERNAL_SERVER_ERROR
        )
      );
  }
};

module.exports = {
  sendMessage,
};
