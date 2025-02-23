const {
  APACHE_CASSANDRA_CONSTANTS,
} = require("../../constants/apacheCassandra.constant");
const {
  DEFAULT_MESSAGE_PROCESSOR_CONSTANTS,
} = require("../../constants/message_processor/message.processor.constant");
const {
  MESSAGE_LISTENER_INTERNAL_RESPONSES,
} = require("../../constants/messangingChannel.constant");
const dataWareHouseHelperFunctions = require("../dataWareHouseUtils/dataWareHouseHelperFunctions");
const {
  isMessageEventConfigHaveNeededKeys,
} = require("../messageUtilities/common.message.utils");
const {
  renderTemplate,
} = require("../messageUtilities/message.template.utils");

const defaultEnhancementForMessageProcessor = (message, templateType) => {
  const { eventConfig, body } = message;
  const dynamicData = body?.dynamicData || {};
  const template = eventConfig?.template || "";
  const templateBody = renderTemplate(templateType, dynamicData, template);
  message.templateBody = templateBody;
};

const defaultValidatorForMessageProcessor = (neededKeysForConfig, message) => {
  const { eventConfig } = message;
  if (!isMessageEventConfigHaveNeededKeys(neededKeysForConfig, eventConfig)) {
    throw new Error(
      MESSAGE_LISTENER_INTERNAL_RESPONSES.MISSING_NEEDED_KEYS_FROM_EVENT_CONFIG_OF_MESSAGE
    );
  }
};

const applyEnhancementAndValidatorsForMessageProcessorOnProvidedData = async ({
  enhancementType = DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_VALIDATOR_TYPES
    .DEFAULT,
  validatorType = DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_ENHANCER_TYPES
    .DEFAULT,
  applyEnhancement = true,
  applyValidation = true,
  message,
  configBasedNeedKeysForValidator,
  templateType,
}) => {
  const messageKey = message.key.toString();

  await dataWareHouseHelperFunctions.insertToWareHouseNotificationDetailedLogs({
    message_id: messageKey,
    input_data: JSON.stringify({
      input: {
        enhancementType,
        validatorType,
        applyEnhancement,
        applyValidation,
        message,
        configBasedNeedKeysForValidator,
        templateType,
      },
    }),
    output_data: JSON.stringify({
      response: `Reached for enhancement and validation by message processor`,
    }),
    process_status:
      APACHE_CASSANDRA_CONSTANTS.TABLE_CONSTANTS.NOTIFICATION_DETAILED_LOGS
        .PROCESS_STATUS.IN_PROGRESS,
  });
  if (applyEnhancement) {
    if (
      enhancementType ==
      DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_ENHANCER_TYPES.DEFAULT
    ) {
      await defaultEnhancementForMessageProcessor(message, templateType);
    } else {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.UN_EXPECTED_MESSAGE_ENHANCER_PROVIDED_VIA_MSG_PROCESSOR
      );
    }
  }

  if (applyValidation) {
    if (
      validatorType ==
      DEFAULT_MESSAGE_PROCESSOR_CONSTANTS.MESSAGE_VALIDATOR_TYPES.DEFAULT
    ) {
      await defaultValidatorForMessageProcessor(
        configBasedNeedKeysForValidator,
        message
      );
    } else {
      throw new Error(
        MESSAGE_LISTENER_INTERNAL_RESPONSES.UN_EXPECTED_MESSAGE_VALIDATOR_PROVIDED_VIA_MSG_PROCESSOR
      );
    }
  }
};

module.exports = {
  applyEnhancementAndValidatorsForMessageProcessorOnProvidedData,
};
