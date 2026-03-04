const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.post("/register", doctorController.addDoctor);
router.post("/login", doctorController.loginDoctor);

router.get("/all", doctorController.getAllDoctors);
router.get("/:doctor_id", doctorController.getDoctorById);
router.put("/:doctor_id", verifyToken, doctorController.updateDoctor);

router.get("/:doctor_id/patients", verifyToken, doctorController.getDoctorPatients);
router.put("/:doctor_id/call-next", verifyToken, doctorController.callNextPatient);
router.put("/complete-consultation/:appointment_id", verifyToken, doctorController.completeConsultation);

module.exports = router;
