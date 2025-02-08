const { MailingStrategy } = require("./mailingStrategies");
const config = require("../../../../config.json");
const Mailjet = require("node-mailjet");
const {
  MESSAGE_LISTENER_INTERNAL_RESPONSES,
} = require("../../../constants/messangingChannel.constant");
const { resultObject } = require("../../common.utils");
const { HTTP_CODES } = require("../../../constants/httpCodes.constant");
const { logger } = require("../../../di-container");
const mailjet = new Mailjet({
  apiKey: config.MAILING_TOOLS.MAILJET.API_KEY,
  apiSecret: config.MAILING_TOOLS.MAILJET.API_KEY_SECRET,
});

class MailjetMailingStrategy extends MailingStrategy {
  initialize() {}

  validateProvidedBodyForSendingMail(mailjetData) {
    if (!mailjetData) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_CORE_DATA_FOR_MAILJET_MAILING_STRATEGY
      );
    }
    let { from, to, subject, TextPart, HTMLPart } = mailjetData;

    if (!from) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_FROM_KEY_FROM_MAILJET_PROVIDED_DATA
      );
    }
    if (!to) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_TO_KEY_FROM_MAILJET_PROVIDED_DATA
      );
    }
    if (!subject) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_SUBJECT_KEY_FROM_MAILJET_PROVIDED_DATA
      );
    }
    if (!HTMLPart && !TextPart) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.NITHER_TEXT_PART_NOR_HTML_PART_KEY_PROVIDED_IN_MAILJET_PROVIDED_DATA
      );
    }

    if (!from?.email) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.IN_FROM_KEY_IN_MAILJET_PROVIDED_DATA_EMAIL_IS_MISSING
      );
    }

    if (!to?.email) {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.IN_TO_KEY_IN_MAILJET_PROVIDED_DATA_EMAIL_IS_MISSING
      );
    }
  }
  async sendMail({ mailjetData, message }) {
    return new Promise((resolve, reject) => {
      const messageKey = message.key.toString();

      this.validateProvidedBodyForSendingMail(mailjetData);
      logger.info(
        `Validated Provided body for sending mail for message: ${messageKey}`,
        {
          mailjetData: mailjetData,
        }
      );
      let { from, to, subject, TextPart, HTMLPart } = mailjetData;
      const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: from?.email,
              ...(from?.name ? { Name: from?.name } : {}),
            },
            To: [
              {
                Email: to?.email,
                ...(to?.name ? { Name: to?.name } : {}),
              },
            ],
            Subject: subject,
            ...(TextPart ? { TextPart: TextPart } : {}),

            ...(HTMLPart ? { HTMLPart: HTMLPart } : {}),
          },
        ],
      });

      request
        .then((result) => {
          logger.info(
            `Received response for mailjet for message: ${messageKey}`,
            {
              mailjetResponse: result.body,
            }
          );
          return resolve(
            resultObject(
              true,
              `Successfully sent mail`,
              {
                responseBody: result.body,
              },
              HTTP_CODES.OK
            )
          );
        })
        .catch((err) => {
          logger.error(
            `Error: Received response for mailjet for message: ${messageKey}`,
            {
              error: err,
            }
          );
          return resolve(
            resultObject(
              false,
              `Failed to sent mail`,
              {
                error: err,
              },
              HTTP_CODES.INTERNAL_SERVER_ERROR
            )
          );
        });
    });
  }
}

module.exports = new MailjetMailingStrategy();
