const xlsx = require("xlsx");
const { exportedDIContainer } = require("../exportedDiContainer");
const serviceTypeServices = require("../services/serviceType.services");
const { generateUUIDV4 } = require("../utils/common.utils");
const {
  autoPopulateExcelSheetRecordParsing,
} = require("../utils/serverSetupUtils/commonServerSetupUtils");
const { logger } = require("../di-container");
const { DATABASE_CONSTANTS } = require("../constants/database.constant");
const notificationEventServices = require("../services/notificationEvent.services");
const notificationEventConfigServices = require("../services/notificationEventConfig.services");

class AutoFillTestDBData {
  constructor() {}

  async populateServiceTypeData() {
    const workbook = xlsx.readFile(
      exportedDIContainer.config.TEST_DATA.DATABASE_TABLES_TEST_FILES
        .SERVICE_TYPE
    );
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const recordsToInsert = [];
    for (let i = 0; i < sheetData.length; i++) {
      const excelRec = sheetData[i];
      const parsedRec = autoPopulateExcelSheetRecordParsing(excelRec);
      recordsToInsert.push(parsedRec);
    }
    await serviceTypeServices.createServiceTypeCoreBulkCreate({
      data: [...recordsToInsert],
      options: { ignoreDuplicates: true },
    });
    logger.info(
      `Auto population of table ${DATABASE_CONSTANTS.TABLES.SERVICE_TYPE} Done!.`
    );
  }
  async populateNotificationEventData() {
    const workbook = xlsx.readFile(
      exportedDIContainer.config.TEST_DATA.DATABASE_TABLES_TEST_FILES
        .NOTIFICATION_EVENT
    );
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const recordsToInsert = [];
    for (let i = 0; i < sheetData.length; i++) {
      const excelRec = sheetData[i];
      const parsedRec = autoPopulateExcelSheetRecordParsing(excelRec);
      recordsToInsert.push(parsedRec);
    }
    await notificationEventServices.createNotificationEventCoreBulkCreate({
      data: [...recordsToInsert],
      options: { ignoreDuplicates: true },
    });
    logger.info(
      `Auto population of table ${DATABASE_CONSTANTS.TABLES.NOTIFICATION_EVENT} Done!.`
    );
  }

  async populateNotificationEventConfigData() {
    const workbook = xlsx.readFile(
      exportedDIContainer.config.TEST_DATA.DATABASE_TABLES_TEST_FILES
        .NOTIFICANIA_EVENT_CONFIG
    );
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const recordsToInsert = [];
    for (let i = 0; i < sheetData.length; i++) {
      const excelRec = sheetData[i];
      const parsedRec = autoPopulateExcelSheetRecordParsing(excelRec);
      recordsToInsert.push(parsedRec);
    }
    await notificationEventConfigServices.createNotificationEventConfigCoreBulkCreate(
      {
        data: [...recordsToInsert],
        options: { ignoreDuplicates: true },
      }
    );
    logger.info(
      `Auto population of table ${DATABASE_CONSTANTS.TABLES.NOTIFICATION_EVENT_CONFIG} Done!.`
    );
  }
}

module.exports = AutoFillTestDBData;
