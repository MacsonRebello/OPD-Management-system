const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Add Doctor (Admin)
exports.addDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, department, specialization, experience, availability } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO doctors 
    (name, email, password, phone, department, specialization, experience, availability, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`;

    db.query(
      sql,
      [name, email, hashedPassword, phone, department, specialization, experience, availability || "09:00-17:00"],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
          }
          return res.status(500).json({ message: "Error adding doctor", error: err.message });
        }

        res.status(201).json({
          message: "Doctor registered successfully. Please wait for admin approval.",
          doctor_id: result.insertId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Doctors
exports.getAllDoctors = (req, res) => {
  try {
    const { department } = req.query;

    let sql = "SELECT doctor_id, name, email, phone, department, specialization, experience, availability, is_active FROM doctors";
    let params = [];

    if (department) {
      sql += " WHERE department=?";
      params.push(department);
    }

    db.query(sql, params, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching doctors", error: err.message });
      }

      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Doctor by ID
exports.getDoctorById = (req, res) => {
  try {
    const doctor_id = req.params.doctor_id;

    const sql = "SELECT doctor_id, name, email, phone, department, specialization, experience, availability, is_active FROM doctors WHERE doctor_id=?";

    db.query(sql, [doctor_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching doctor", error: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      res.json(result[0]);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Doctor
exports.updateDoctor = (req, res) => {
  try {
    const doctor_id = req.params.doctor_id;
    const { name, phone, department, specialization, experience, availability, is_active } = req.body;

    const sql = `UPDATE doctors SET name=?, phone=?, department=?, specialization=?, experience=?, availability=?, is_active=? WHERE doctor_id=?`;

    db.query(sql, [name, phone, department, specialization, experience, availability, is_active, doctor_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Update failed", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      res.json({ message: "Doctor updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Doctor Login
exports.loginDoctor = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const sql = "SELECT * FROM doctors WHERE email=?";

    db.query(sql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Login failed", error: err.message });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Doctor not found" });
      }

      const doctor = result[0];
      const validPassword = await bcrypt.compare(password, doctor.password);

      if (!validPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: doctor.doctor_id, role: "doctor" },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        doctor_id: doctor.doctor_id,
        name: doctor.name,
        department: doctor.department,
        is_active: doctor.is_active,
        token: token
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Doctor's Patients (Queue)
exports.getDoctorPatients = (req, res) => {
  try {
    const doctor_id = req.params.doctor_id;
    const { appointment_date } = req.query;

    let sql = `SELECT a.appointment_id, a.token_number, a.appointment_time, a.status, p.name, p.phone, p.age, a.reason
               FROM appointments a
               JOIN patients p ON a.patient_id = p.patient_id
               WHERE a.doctor_id=? AND a.status IN ('scheduled', 'in_progress')`;
    
    let params = [doctor_id];

    if (appointment_date) {
      sql += " AND a.appointment_date=?";
      params.push(appointment_date);
    }

    sql += " ORDER BY a.token_number ASC";

    db.query(sql, params, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching patients", error: err.message });
      }

      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Call Next Patient
exports.callNextPatient = (req, res) => {
  try {
    const doctor_id = req.params.doctor_id;
    const { appointment_date } = req.body;

    const sql = `UPDATE appointments SET status='in_progress' 
                 WHERE doctor_id=? AND appointment_date=? AND status='scheduled'
                 ORDER BY token_number ASC LIMIT 1`;

    db.query(sql, [doctor_id, appointment_date], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error calling patient", error: err.message });
      }

      res.json({ message: "Patient called", updated: result.affectedRows });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark Consultation Complete
exports.completeConsultation = (req, res) => {
  try {
    const appointment_id = req.params.appointment_id;

    const sql = "UPDATE appointments SET status='completed' WHERE appointment_id=?";

    db.query(sql, [appointment_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error completing consultation", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json({ message: "Consultation completed" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
