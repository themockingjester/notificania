const { APPLICATION_CONSTANTS } = require("../../constants/application.constant")
const ejs = require("ejs");
const { MESSAGE_LISTENER_INTERNAL_RESPONSES } = require("../../constants/messangingChannel.constant")

const renderTemplate = (templateType, dynamicData, template) => {
    if (templateType == APPLICATION_CONSTANTS.SUPPORTED_MESSAGE_TEMPLATES.EJS_TEMPLATE) {
        return renderEJSTemplate(template, dynamicData)
    } else {
        throw new Error(MESSAGE_LISTENER_INTERNAL_RESPONSES.UNSUPPORTED_TEMPLATE_TYPE)
    }
}

const renderEJSTemplate = (template, dynamicData) => {
    return ejs.render(template, dynamicData);
}
module.exports = {
    renderTemplate
}