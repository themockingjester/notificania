const { APPLICATION_CONSTANTS } = require("../../constants/application.constant");
const { MAIL_MESSAGE_PROCESSOR_CONSTANTS } = require("../../constants/message_processor/mail.message.processor.constant");
const mailjetMailingStrategy = require("../../utils/mailUtilities/mailingStrategies/mailjetMailingStrategy")
const { DEFAULT_MESSAGE_PROCESSOR_CONSTANTS } = require("../../constants/message_processor/message.processor.constant");
const { getMailingStrategy } = require("../../utils/mailUtilities/mailingStrategies/getMailingStrategy");
const { applyEnhancementAndValidatorsForMessageProcessorOnProvidedData } = require("../../utils/messageProcessorUtils");
const { config } = require("../../di-container");
const { MESSAGE_LISTENER_INTERNAL_RESPONSES } = require("../../constants/messangingChannel.constant");


class MailMessageProcessor {
    processorType = APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR.MAIL_MESSAGE_PROCESSOR
    async sendMailAux(message) {

        await applyEnhancementAndValidatorsForMessageProcessorOnProvidedData(
            {
                enhancementType: DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_ENHANCER_TYPES.DEFAULT,
                validatorType: DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_VALIDATOR_TYPES.DEFAULT,
                applyValidation: true,
                applyEnhancement: true,
                message,
                configBasedNeedKeysForValidator: MAIL_MESSAGE_PROCESSOR_CONSTANTS.SEND_MAIL.NEEDED_KEYS_FOR_CONFIG,
                templateType: APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES_ADDITIONAL_DATA.SEND_MAIL.SUPPORTED_MESSAGE_TEMPALTE
            }
        )

        await this.sendMail()
        console.log(message, 664232) // TODO: continue from here
    }




    async sendMail() {
        let mailingStrategy
        let objBody = {}
        if (config.MAILING_TOOLS.MAILJET.ENABLED) {
            mailingStrategy = getMailingStrategy(mailjetMailingStrategy)
            objBody = {
                mailjetData: {
                    from: {
                        email: "y"
                    },
                    to: {
                        email: "yur13@gmail.com"
                    },
                    subject: "Test Email",
                    TextPart: "Hello",
                    // HTMLPart,
                }
            }
        } else {
            throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.UN_EXPECTED_MAILING_STRATEGY_FOUND)
        }
        let result = mailingStrategy.sendMail(objBody)
        console.log(result, 65788) // TODO  : Continuwe from here

    }
}

module.exports = new MailMessageProcessor();