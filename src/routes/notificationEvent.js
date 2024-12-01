const { addNotificationEventController, updateNotificationEventController, fetchAllNotificationEventController, fetchSpecificNotificationEventController } = require('../controllers/notificationEvent.controller');
const router = require('express').Router();

router.post('/', addNotificationEventController)
router.patch('/:notificationEventId', updateNotificationEventController)
router.get('/', fetchAllNotificationEventController)
router.get('/:notificationEventId', fetchSpecificNotificationEventController)


module.exports = router