const { APPLICATION_CONSTANTS } = require("../../constants/application.constant");
const { MAIL_MESSAGE_PROCESSOR_CONSTANTS } = require("../../constants/message_processor/mail.message.processor.constant");
const mailjetMailingStrategy = require("../../utils/mailUtilities/mailingStrategies/mailjetMailingStrategy")
const { DEFAULT_MESSAGE_PROCESSOR_CONSTANTS } = require("../../constants/message_processor/message.processor.constant");
const { getMailingStrategy } = require("../../utils/mailUtilities/mailingStrategies/getMailingStrategy");
const { applyEnhancementAndValidatorsForMessageProcessorOnProvidedData } = require("../../utils/messageProcessorUtils");
const { config } = require("../../di-container");
const { MESSAGE_LISTENER_INTERNAL_RESPONSES } = require("../../constants/messangingChannel.constant");

const { resultObject } = require("../../utils/common.utils");


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

        const mailingResponse = await this.sendMail(message)
        return resultObject(mailingResponse.success, mailingResponse.message, mailingResponse.data, mailingResponse.code)
    }




    async sendMail(message) {
        let mailingStrategy
        let objBody = {}
        let mailerUsed = ""
        let { eventConfig, body, templateBody } = message
        if (config.MAILING_TOOLS.MAILJET.ENABLED) {
            mailingStrategy = getMailingStrategy(mailjetMailingStrategy)
            objBody = {
                mailjetData: {
                    from: {
                        email: eventConfig?.senderDefaultMail,
                        ...(eventConfig?.senderDefaultMailingName ? { name: eventConfig?.senderDefaultMailingName } : {})
                    },
                    to: {
                        email: body?.receipientEmail
                    },
                    subject: eventConfig?.subject,
                    // TextPart: eventConfig?.templateBody,
                    HTMLPart: templateBody
                }
            }
            mailerUsed = APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES_ADDITIONAL_DATA.SEND_MAIL.MAILER_SUPPORTED.MAILJET
        } else {
            throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.UN_EXPECTED_MAILING_STRATEGY_FOUND)
        }
        const coreResponseObject = await mailingStrategy.sendMail(objBody)
        coreResponseObject.data.mailerUsed = mailerUsed
        const refinedResponseObject = await this.sendMailAuxResponseAdapter(coreResponseObject)

        return resultObject(refinedResponseObject.success, refinedResponseObject.message, refinedResponseObject.data, refinedResponseObject.code)

    }



    /**
     * This function converts the final response into a command similar object format
     * @param {JSON Object} response 
     * @returns JSON
     */
    async sendMailAuxResponseAdapter(response) {
        // Here we can do things like logging etc 

        let finalDataToReturn = {}
        if (response.data.mailerUsed) {
            finalDataToReturn.mailerUsed = response.data.mailerUsed
        }
        return resultObject(response.success, response.message, finalDataToReturn, response.code)
    }
}

module.exports = new MailMessageProcessor();