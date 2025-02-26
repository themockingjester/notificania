autoPopulateExcelSheetRecordParsing = (record) => {
  let finalRecord = {};
  let keys = Object.keys(record);
  for (let i = 0; i < keys.length; i++) {
    let currKey = keys[i];
    if (currKey == "createdAt" || currKey == "updatedAt") {
      finalRecord[currKey] = new Date();
    } else if (record[currKey] === "NULL") {
      finalRecord[currKey] = null;
    } else {
      finalRecord[currKey] = record[currKey];
    }
  }
  return finalRecord;
};

module.exports = {
  autoPopulateExcelSheetRecordParsing,
};
