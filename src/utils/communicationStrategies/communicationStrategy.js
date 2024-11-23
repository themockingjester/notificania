class CommunicationStrategy {
    /** string */
    isEnabled // boolean

    /**
     * 
     * @param {CommunicationStrategy} strategy 
     */
    constructor(strategy) {
        this.strategy = strategy;

    }
    /**
     * 
     * @param {object} data 
     */
    async sendMessage(data) {
        return await this.strategy.sendMessage(data)
    }
}
module.exports = CommunicationStrategy