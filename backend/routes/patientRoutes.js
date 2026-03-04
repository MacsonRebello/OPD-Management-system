const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { verifyToken } = require("../middleware/auth");

router.post("/register", patientController.registerPatient);
router.post("/login", patientController.loginPatient);

router.get("/profile/:patient_id", verifyToken, patientController.getProfile);
router.put("/profile/:patient_id", verifyToken, patientController.updateProfile);
router.get("/appointments/:patient_id", verifyToken, patientController.getAppointmentHistory);
router.get("/all", patientController.getAllPatients); // Admin

module.exports = router;
