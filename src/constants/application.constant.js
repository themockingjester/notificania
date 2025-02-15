module.exports = {
  APPLICATION_CONSTANTS: {
    SUPPORTED_SERVICE_TYPES: {
      FIREBASE_PUSH_NOTIFICATION: "FIREBASE_PUSH_NOTIFICATION",
      SEND_MAIL: "SEND_MAIL",
      SEND_SMS: "SEND_SMS",
    },
    SUPPORTED_MESSAGE_PROCESSOR: {
      FIREBASE_MESSAGE_PROCESSOR: "FIREBASE_MESSAGE_PROCESSOR",
      MAIL_MESSAGE_PROCESSOR: "MAIL_MESSAGE_PROCESSOR",
      SMS_MESSAGE_PROCESSOR: "SMS_MESSAGE_PROCESSOR",
    },
    SUPPORTED_MESSAGE_TEMPLATES: {
      EJS_TEMPLATE: "EJS_TEMPLATE",
    },
    SUPPORTED_SERVICE_TYPES_ADDITIONAL_DATA: {
      FIREBASE_PUSH_NOTIFICATION: {
        SUPPORTED_MESSAGE_TEMPALTE: "EJS_TEMPLATE",
      },
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
    },
  },
};
