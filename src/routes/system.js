const { getSystemStatus } = require('../services/system.services');
const router = require('express').Router();

router.get('/status', getSystemStatus)

module.exports = router