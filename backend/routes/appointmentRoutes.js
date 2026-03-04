const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { verifyToken } = require("../middleware/auth");

router.post("/book", verifyToken, appointmentController.bookAppointment);
router.get("/available-slots", appointmentController.getAvailableSlots);
router.get("/queue-status", appointmentController.getQueueStatus);
router.put("/cancel/:appointment_id", verifyToken, appointmentController.cancelAppointment);

module.exports = router;
