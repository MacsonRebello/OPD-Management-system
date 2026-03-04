const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Patient
exports.registerPatient = async (req, res) => {
  try {
    const { name, phone, age, gender, email, password, medical_id } = req.body;

    // Validation
    if (!name || !phone || !age || !gender || !email || !password || !medical_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO patients 
    (name, phone, age, gender, email, password, medical_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [name, phone, age, gender, email, hashedPassword, medical_id],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
          }
          return res.status(500).json({ message: "Registration failed", error: err.message });
        }

        res.status(201).json({
          message: "Patient registered successfully",
          patient_id: result.insertId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login Patient
exports.loginPatient = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const sql = "SELECT * FROM patients WHERE email=?";

    db.query(sql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Login failed", error: err.message });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const patient = result[0];
      const validPassword = await bcrypt.compare(password, patient.password);

      if (!validPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: patient.patient_id, role: "patient" },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        patient_id: patient.patient_id,
        name: patient.name,
        token: token
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Patient Profile
exports.getProfile = (req, res) => {
  try {
    const patient_id = req.params.patient_id;

    const sql = "SELECT patient_id, name, phone, age, gender, email, medical_id, created_at FROM patients WHERE patient_id=?";

    db.query(sql, [patient_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching profile", error: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json(result[0]);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Patient Profile
exports.updateProfile = async (req, res) => {
  try {
    const patient_id = req.params.patient_id;
    const { name, phone, age, gender } = req.body;

    const sql = "UPDATE patients SET name=?, phone=?, age=?, gender=? WHERE patient_id=?";

    db.query(sql, [name, phone, age, gender, patient_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Update failed", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json({ message: "Profile updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Appointment History
exports.getAppointmentHistory = (req, res) => {
  try {
    const patient_id = req.params.patient_id;

    const sql = `SELECT a.appointment_id, a.appointment_date, a.appointment_time, 
                 a.status, a.token_number, d.name as doctor_name, d.department
                 FROM appointments a
                 JOIN doctors d ON a.doctor_id = d.doctor_id
                 WHERE a.patient_id=?
                 ORDER BY a.appointment_date DESC`;

    db.query(sql, [patient_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching appointments", error: err.message });
      }

      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Patients (Admin)
exports.getAllPatients = (req, res) => {
  try {
    const sql = "SELECT patient_id, name, phone, age, gender, email, medical_id, created_at FROM patients";

    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching patients", error: err.message });
      }

      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
