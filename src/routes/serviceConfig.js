const { addServiceConfigController, updateServiceConfigController, fetchAllServiceConfigController, fetchSpecificServiceConfigController } = require('../controllers/serviceConfig.controller');
const router = require('express').Router();

router.post('/', addServiceConfigController)
router.patch('/:serviceConfigId', updateServiceConfigController)
router.get('/', fetchAllServiceConfigController)
router.get('/:serviceConfigId', fetchSpecificServiceConfigController)


module.exports = router