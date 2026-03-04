const db = require("../db");

// Add Bed (Admin)
exports.addBed = (req, res) => {
  try {
    const { bed_number, bed_type, department, status } = req.body;

    if (!bed_number || !bed_type || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sql = `INSERT INTO beds 
    (bed_number, bed_type, department, status)
    VALUES (?, ?, ?, ?)`;

    db.query(
      sql,
      [bed_number, bed_type, department, status || "available"],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error adding bed", error: err.message });
        }

        res.status(201).json({
          message: "Bed added successfully",
          bed_id: result.insertId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Beds
exports.getAllBeds = (req, res) => {
  try {
    const { department, bed_type, status } = req.query;

    let sql = "SELECT * FROM beds";
    let params = [];
    let conditions = [];

    if (department) {
      conditions.push("department=?");
      params.push(department);
    }

    if (bed_type) {
      conditions.push("bed_type=?");
      params.push(bed_type);
    }

    if (status) {
      conditions.push("status=?");
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    db.query(sql, params, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching beds", error: err.message });
      }

      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Bed Availability Summary
exports.getBedAvailability = (req, res) => {
  try {
    const sql = `SELECT 
                   bed_type,
                   COUNT(*) as total_beds,
                   SUM(CASE WHEN status='available' THEN 1 ELSE 0 END) as available_beds,
                   SUM(CASE WHEN status='occupied' THEN 1 ELSE 0 END) as occupied_beds,
                   SUM(CASE WHEN status='maintenance' THEN 1 ELSE 0 END) as maintenance_beds
                 FROM beds
                 GROUP BY bed_type`;

    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching availability", error: err.message });
      }

      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Allocate Bed
exports.allocateBed = (req, res) => {
  try {
    const { bed_id, patient_id, admission_date, reason } = req.body;

    if (!bed_id || !patient_id) {
      return res.status(400).json({ message: "Bed ID and Patient ID are required" });
    }

    // Check if bed is available
    const checkSql = "SELECT status FROM beds WHERE bed_id=?";

    db.query(checkSql, [bed_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error checking bed status", error: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Bed not found" });
      }

      if (result[0].status !== "available") {
        return res.status(400).json({ message: "Bed is not available" });
      }

      // Create admission record
      const insertSql = `INSERT INTO admissions 
      (patient_id, bed_id, admission_date, reason, status)
      VALUES (?, ?, ?, ?, ?)`;

      db.query(
        insertSql,
        [patient_id, bed_id, admission_date || new Date(), reason || null, "admitted"],
        (err, admissionResult) => {
          if (err) {
            return res.status(500).json({ message: "Error allocating bed", error: err.message });
          }

          // Update bed status
          const updateBedSql = "UPDATE beds SET status='occupied' WHERE bed_id=?";

          db.query(updateBedSql, [bed_id], (err) => {
            if (err) {
              return res.status(500).json({ message: "Error updating bed status", error: err.message });
            }

            res.status(201).json({
              message: "Bed allocated successfully",
              admission_id: admissionResult.insertId,
              bed_id: bed_id
            });
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Release Bed
exports.releaseBed = (req, res) => {
  try {
    const { admission_id, discharge_date } = req.body;

    if (!admission_id) {
      return res.status(400).json({ message: "Admission ID is required" });
    }

    // Get admission details
    const getSql = "SELECT bed_id FROM admissions WHERE admission_id=?";

    db.query(getSql, [admission_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching admission", error: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Admission not found" });
      }

      const bed_id = result[0].bed_id;

      // Update admission status
      const updateAdmissionSql = "UPDATE admissions SET status='discharged', discharge_date=? WHERE admission_id=?";

      db.query(updateAdmissionSql, [discharge_date || new Date(), admission_id], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error updating admission", error: err.message });
        }

        // Update bed status
        const updateBedSql = "UPDATE beds SET status='available' WHERE bed_id=?";

        db.query(updateBedSql, [bed_id], (err) => {
          if (err) {
            return res.status(500).json({ message: "Error releasing bed", error: err.message });
          }

          res.json({ message: "Bed released successfully" });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Bed Status (Maintenance, etc.)
exports.updateBedStatus = (req, res) => {
  try {
    const bed_id = req.params.bed_id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const sql = "UPDATE beds SET status=? WHERE bed_id=?";

    db.query(sql, [status, bed_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating bed", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Bed not found" });
      }

      res.json({ message: "Bed status updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
