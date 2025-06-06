module.exports = {
  APPLICATION_CONSTANTS: {
    SUPPORTED_SERVICE_TYPES: {
      PUSH_NOTIFICATION: "PUSH_NOTIFICATION",
      SEND_MAIL: "SEND_MAIL",
      SEND_SMS: "SEND_SMS",
    },
    SUPPORTED_MESSAGE_PROCESSOR: {
      PUSH_NOTIFICATION_MESSAGE_PROCESSOR:
        "PUSH_NOTIFICATION_MESSAGE_PROCESSOR",
      MAIL_MESSAGE_PROCESSOR: "MAIL_MESSAGE_PROCESSOR",
      SMS_MESSAGE_PROCESSOR: "SMS_MESSAGE_PROCESSOR",
    },
    SUPPORTED_MESSAGE_TEMPLATES: {
      EJS_TEMPLATE: "EJS_TEMPLATE",
    },
    SUPPORTED_SERVICE_TYPES_ADDITIONAL_DATA: {
      SEND_MAIL: {
        SUPPORTED_MESSAGE_TEMPALTE: "EJS_TEMPLATE",
        MAILER_SUPPORTED: {
          MAILJET: "MAILJET",
        },
      },
      SEND_SMS: {
        SUPPORTED_MESSAGE_TEMPALTE: "EJS_TEMPLATE",
        SENDER_SUPPORTED: {
          TWILIO: "TWILIO",
        },
      },
      SEND_PUSH_NOTIFICATION: {
        SUPPORTED_MESSAGE_TEMPALTE: "EJS_TEMPLATE",
        SENDER_SUPPORTED: {
          FIREBASE: "FIREBASE",
        },
      },
    },
  },
};
