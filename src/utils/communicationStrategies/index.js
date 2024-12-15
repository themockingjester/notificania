class BaseCommunicationChannel {
    getChannel(strategy) {
        return new strategy()
    }
}

module.exports = BaseCommunicationChannel