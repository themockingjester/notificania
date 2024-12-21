const { APPLICATION_CONSTANTS } = require("../../constants/application.constant")
const { MESSAGE_LISTENER_INTERNAL_RESPONSES } = require("../../constants/messangingChannel.constant")
const firebaseMessageProcessor = require("./firebase.message.processor")

const getMessageProcessor = (serviceType) => {
    if (serviceType == APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES.FIREBASE_PUSH_NOTIFICATION) {
        return firebaseMessageProcessor
    } else {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.UNIMPLEMENTED_SERVICE_PROVIDED)
    }
}

const processMessageByProcessor = (message) => {
    const { messageProcessor } = message
    if (messageProcessor.processorType == APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR.FIREBASE_MESSAGE_PROCESSOR) {
        return processFirebaseMessage(message)
    } else {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.INVALID_MESSAGE_PROCESSOR_FOUND)
    }
}

const processFirebaseMessage = (message) => {
    const { serviceType } = message
    if (serviceType == APPLICATION_CONSTANTS.SUPPORTED_SERVICE_TYPES.FIREBASE_PUSH_NOTIFICATION) {
        return message.messageProcessor.pushNotification()
    } else {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.UNABLE_TO_IDENTIFY_CORRECT_FUNCTION_FOR_GIVEN_SERVICE_TYPE)
    }
}

module.exports = {
    getMessageProcessor, processMessageByProcessor
}