const db = require("../db");

// Get Daily Patient Count
exports.getDailyPatientCount = (req, res) => {
  try {
    const { date } = req.query;

    let sql = `SELECT COUNT(*) as total_patients
               FROM appointments
               WHERE DATE(appointment_date)=?`;

    const params = [date || new Date().toISOString().split('T')[0]];

    db.query(sql, params, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching patient count", error: err.message });
      }

      res.json({
        date: params[0],
        total_patients: result[0].total_patients || 0
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Average Waiting Time
exports.getAverageWaitingTime = (req, res) => {
  try {
    const { date } = req.query;

    let sql = `SELECT 
                 AVG(TIMESTAMPDIFF(MINUTE, appointment_time, completed_time)) as avg_waiting_time,
                 COUNT(*) as total_consultations
               FROM appointments
               WHERE status='completed'`;

    let params = [];

    if (date) {
      sql += " AND DATE(appointment_date)=?";
      params.push(date);
    }

    db.query(sql, params, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error calculating waiting time", error: err.message });
      }

      res.json({
        average_waiting_time: result[0].avg_waiting_time || 0,
        total_consultations: result[0].total_consultations || 0
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Doctor Workload
exports.getDoctorWorkload = (req, res) => {
  try {
    const { date } = req.query;

    let sql = `SELECT 
                 d.doctor_id,
                 d.name,
                 d.department,
                 COUNT(*) as total_patients,
                 SUM(CASE WHEN a.status='completed' THEN 1 ELSE 0 END) as completed_consultations
               FROM doctors d
               LEFT JOIN appointments a ON d.doctor_id = a.doctor_id`;

    let params = [];

    if (date) {
      sql += " WHERE DATE(a.appointment_date)=?";
      params.push(date);
    }

    sql += " GROUP BY d.doctor_id ORDER BY total_patients DESC";

    db.query(sql, params, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching workload", error: err.message });
      }

      res.json({
        date: date || "All time",
        doctors: result
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Bed Utilization
exports.getBedUtilization = (req, res) => {
  try {
    const sql = `SELECT 
                   b.bed_type,
                   COUNT(b.bed_id) as total_beds,
                   SUM(CASE WHEN b.status='occupied' THEN 1 ELSE 0 END) as occupied_beds,
                   ROUND(SUM(CASE WHEN b.status='occupied' THEN 1 ELSE 0 END) / COUNT(b.bed_id) * 100, 2) as utilization_percentage
                 FROM beds b
                 GROUP BY b.bed_type`;

    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching utilization", error: err.message });
      }

      res.json({
        bed_types: result
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Department Statistics
exports.getDepartmentStats = (req, res) => {
  try {
    const sql = `SELECT 
                   d.department,
                   COUNT(DISTINCT a.appointment_id) as total_appointments,
                   COUNT(DISTINCT a.patient_id) as unique_patients,
                   COUNT(DISTINCT d.doctor_id) as doctors_available,
                   SUM(CASE WHEN a.status='completed' THEN 1 ELSE 0 END) as completed_appointments
                 FROM doctors d
                 LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
                 GROUP BY d.department`;

    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching department stats", error: err.message });
      }

      res.json({
        departments: result
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Monthly Report
exports.getMonthlyReport = (req, res) => {
  try {
    const { year, month } = req.query;

    const currentDate = new Date();
    const reportYear = year || currentDate.getFullYear();
    const reportMonth = month || (currentDate.getMonth() + 1);

    const sql = `SELECT 
                   DATE(a.appointment_date) as date,
                   COUNT(*) as total_appointments,
                   SUM(CASE WHEN a.status='completed' THEN 1 ELSE 0 END) as completed,
                   SUM(CASE WHEN a.status='cancelled' THEN 1 ELSE 0 END) as cancelled,
                   SUM(CASE WHEN a.status='no_show' THEN 1 ELSE 0 END) as no_show
                 FROM appointments a
                 WHERE YEAR(a.appointment_date)=? AND MONTH(a.appointment_date)=?
                 GROUP BY DATE(a.appointment_date)
                 ORDER BY date ASC`;

    db.query(sql, [reportYear, reportMonth], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching monthly report", error: err.message });
      }

      res.json({
        year: reportYear,
        month: reportMonth,
        report: result
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Dashboard Summary
exports.getDashboardSummary = (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get today's appointments
    const appointmentSql = `SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date)=?`;
    
    // Get total doctors
    const doctorSql = "SELECT COUNT(*) as count FROM doctors";
    
    // Get bed availability
    const bedSql = `SELECT 
                     COUNT(*) as total,
                     SUM(CASE WHEN status='available' THEN 1 ELSE 0 END) as available,
                     SUM(CASE WHEN status='occupied' THEN 1 ELSE 0 END) as occupied
                   FROM beds`;
    
    // Get total patients
    const patientSql = "SELECT COUNT(*) as count FROM patients";

    db.query(appointmentSql, [today], (err, appointments) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching summary", error: err.message });
      }

      db.query(doctorSql, (err, doctors) => {
        if (err) {
          return res.status(500).json({ message: "Error fetching summary", error: err.message });
        }

        db.query(bedSql, (err, beds) => {
          if (err) {
            return res.status(500).json({ message: "Error fetching summary", error: err.message });
          }

          db.query(patientSql, (err, patients) => {
            if (err) {
              return res.status(500).json({ message: "Error fetching summary", error: err.message });
            }

            res.json({
              today_appointments: appointments[0].count,
              total_doctors: doctors[0].count,
              total_patients: patients[0].count,
              bed_availability: {
                total_beds: beds[0].total,
                available_beds: beds[0].available,
                occupied_beds: beds[0].occupied
              }
            });
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
