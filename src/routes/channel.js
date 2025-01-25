const channelController = require('../controllers/channel.controller');
const router = require('express').Router();

router.post('/send-message', channelController.sendMessage)


module.exports = router