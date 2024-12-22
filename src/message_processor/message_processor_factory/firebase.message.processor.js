const { APPLICATION_CONSTANTS } = require("../../constants/application.constant");
const { FIREBASE_MESSAGE_PROCESSOR_CONSTANTS } = require("../../constants/message_processor/firebase.message.processor.constant");
const { MESSAGE_LISTENER_INTERNAL_RESPONSES } = require("../../constants/messangingChannel.constant");
const { isMessageEventConfigHaveNeededKeys } = require("../../utils/messageUtilities/common.message.utils");

class FirebaseMessageProcessor {
    processorType = APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR.FIREBASE_MESSAGE_PROCESSOR
    pushNotificationAux(message) {

        const { eventConfig } = message
        if (!isMessageEventConfigHaveNeededKeys(FIREBASE_MESSAGE_PROCESSOR_CONSTANTS.PUSH_NOTIFICATION.NEEDED_KEYS_FOR_CONFIG, eventConfig)) {
            throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_NEEDED_KEYS_FROM_EVENT_CONFIG_OF_MESSAGE)
        }
        console.log(message, 3566) // TODO: continue from here
    }
}

module.exports = new FirebaseMessageProcessor();