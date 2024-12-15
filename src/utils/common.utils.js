
const { v4: uuidv4 } = require('uuid');

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

const generateUUIDV4 = function () {
    return uuidv4();
};
module.exports = {
    generateResponse, resultObject, generateUUIDV4
}