const { addNotificationEventController, updateNotificationEventController, fetchAllNotificationEventController, fetchSpecificNotificationEventController } = require('../controllers/notificationEvent.controller');
const notificationEventConfig = require("./notificationEventConfig")

const router = require('express').Router();

// config route
router.use("/config", notificationEventConfig)

router.post('/', addNotificationEventController)
router.patch('/:notificationEventId', updateNotificationEventController)
router.get('/', fetchAllNotificationEventController)
router.get('/:notificationEventId', fetchSpecificNotificationEventController)


module.exports = router