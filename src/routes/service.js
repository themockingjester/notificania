const { addServiceTypeController, updateServiceTypeController, fetchAllServiceTypeController, fetchSpecificServiceController } = require("../controllers/serviceType.controller");
const router = require('express').Router();

router.post('/', addServiceTypeController)
router.patch('/:serviceId', updateServiceTypeController)
router.get('/', fetchAllServiceTypeController)
router.get('/:serviceId', fetchSpecificServiceController)


module.exports = router