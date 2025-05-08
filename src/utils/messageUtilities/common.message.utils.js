const prepareProperObjectOutOfNotificationEventConfigDetailsForAMessage = (
  notificationEventConfig = []
) => {
  let finalResult = {};
  for (let i = 0; i < notificationEventConfig.length; i++) {
    const currConfig = notificationEventConfig[i];
    if (currConfig.valueAsJSON) {
      finalResult[`${currConfig.key}`] = currConfig.valueAsJSON;
    } else {
      finalResult[`${currConfig.key}`] = `${currConfig.value}`;
    }
  }
  return finalResult;
};
const isMessageEventConfigHaveNeededKeys = (neededKeys, messageConfig) => {
  for (let i = 0; i < neededKeys.length; i++) {
    const currKey = neededKeys[i];
    if ([undefined, null].includes(messageConfig[currKey])) {
      throw new Error(`${currKey} is not present in message event config`);
    }
  }
  return true;
};

module.exports = {
  prepareProperObjectOutOfNotificationEventConfigDetailsForAMessage,
  isMessageEventConfigHaveNeededKeys,
};
