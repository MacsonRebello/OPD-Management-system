const express = require("express");
const router = express.Router();
const bedController = require("../controllers/bedController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.post("/add", verifyAdmin, bedController.addBed);
router.get("/all", bedController.getAllBeds);
router.get("/availability", bedController.getBedAvailability);

router.post("/allocate", verifyAdmin, bedController.allocateBed);
router.put("/release", verifyAdmin, bedController.releaseBed);
router.put("/:bed_id/status", verifyAdmin, bedController.updateBedStatus);

module.exports = router;
