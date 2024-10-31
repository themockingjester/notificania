
/**
 * 
 * @param {boolean} success 
 * @param {string} message 
 * @param {json} data 
 * @param {number} code 
 * @returns JSON object
 */
const resultObject = function (success, message, data, code) {
    return {
        success,
        message,
        data,
        code,
    };
};

/**
 * 
 * @param {boolean} success 
 * @param {string} message 
 * @param {json} data 
 * @param {number} code 
 * @returns JSON object
 */
const generateResponse = function (success, message, data, code) {
    return {
        success,
        message,
        data,
        code,
    };
};

module.exports = {
    generateResponse, resultObject
}