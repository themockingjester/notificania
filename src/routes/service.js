const { addServiceTypeController } = require('../controllers/serviceType.controller');
const router = require('express').Router();

router.post('/', addServiceTypeController)

module.exports = router