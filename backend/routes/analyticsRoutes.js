const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { verifyAdmin } = require("../middleware/auth");

router.get("/daily-count", verifyAdmin, analyticsController.getDailyPatientCount);
router.get("/waiting-time", verifyAdmin, analyticsController.getAverageWaitingTime);
router.get("/doctor-workload", verifyAdmin, analyticsController.getDoctorWorkload);
router.get("/bed-utilization", verifyAdmin, analyticsController.getBedUtilization);
router.get("/department-stats", verifyAdmin, analyticsController.getDepartmentStats);
router.get("/monthly-report", verifyAdmin, analyticsController.getMonthlyReport);
router.get("/dashboard-summary", verifyAdmin, analyticsController.getDashboardSummary);

module.exports = router;
