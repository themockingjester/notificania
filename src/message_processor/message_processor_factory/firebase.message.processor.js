const { APPLICATION_CONSTANTS } = require("../../constants/application.constant");

class FirebaseMessageProcessor {
    processorType = APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_PROCESSOR.FIREBASE_MESSAGE_PROCESSOR
    pushNotification() {
        //TODO: need to implement this
    }
}

module.exports = new FirebaseMessageProcessor();