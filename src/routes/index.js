const router = require("express").Router();
const system = require("./system")
router.use("/system", system)

module.exports = router