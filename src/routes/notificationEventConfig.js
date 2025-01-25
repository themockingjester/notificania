const { addNotificationEventConfigController, updateNotificationEventConfigController, fetchAllNotificationEventConfigController, fetchSpecificNotificationEventConfigController } = require('../controllers/notificationEventConfig.controller');
const router = require('express').Router();

router.post('/', addNotificationEventConfigController)
router.patch('/:notificationEventConfigId', updateNotificationEventConfigController)
router.get('/', fetchAllNotificationEventConfigController)
router.get('/:notificationEventConfigId', fetchSpecificNotificationEventConfigController)


module.exports = router