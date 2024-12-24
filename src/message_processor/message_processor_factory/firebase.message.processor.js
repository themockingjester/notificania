const { APPLICATION_CONSTANTS } = require("../../constants/application.constant");
const { FIREBASE_MESSAGE_PROCESSOR_CONSTANTS } = require("../../constants/message_processor/firebase.message.processor.constant");
const { DEFAULT_MESSAGE_PROCESSOR_CONSTANTS } = require("../../constants/message_processor/message.processor.constant");
const { applyEnhancementAndValidatorsForMessageProcessorOnProvidedData } = require("../../utils/messageProcessorUtils");


class FirebaseMessageProcessor {
    processorType = APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR.FIREBASE_MESSAGE_PROCESSOR
    async pushNotificationAux(message) {

        await applyEnhancementAndValidatorsForMessageProcessorOnProvidedData(
            {
                enhancementType: DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_ENHANCER_TYPES.DEFAULT,
                validatorType: DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_VALIDATOR_TYPES.DEFAULT,
                applyValidation: true,
                applyEnhancement: false,
                message,
                configBasedNeedKeysForValidator: FIREBASE_MESSAGE_PROCESSOR_CONSTANTS.PUSH_NOTIFICATION.NEEDED_KEYS_FOR_CONFIG,
                templateType: APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES_ADDITIONAL_DATA.FIREBASE_PUSH_NOTIFICATION.SUPPORTED_MESSAGE_TEMPALTE
            }
        )

        console.log(message, 3566) // TODO: continue from here
    }
}

module.exports = new FirebaseMessageProcessor();