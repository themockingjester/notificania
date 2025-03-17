const {
  getSystemStatus,
  revertClientRequestServingToogle,
} = require("../services/system.services");
const router = require("express").Router();

router.get("/status", getSystemStatus);
router.post(
  "/revert-client-request-serving-toggle",
  revertClientRequestServingToogle
);

module.exports = router;
