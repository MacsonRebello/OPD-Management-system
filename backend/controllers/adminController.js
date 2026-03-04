const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminController = {
  // Admin Login
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const query = 'SELECT * FROM admins WHERE email = ?';
      db.query(query, [email], async (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const admin = results[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: admin.admin_id, email: admin.email, role: admin.role },
          process.env.JWT_SECRET || 'opd_secret_key_2026_demo',
          { expiresIn: '24h' }
        );

        res.status(200).json({
          message: 'Login successful',
          token,
          user: {
            id: admin.admin_id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        });
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  },

  // Register Admin (for setup)
  registerAdmin: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = 'INSERT INTO admins (name, email, password, role, is_active) VALUES (?, ?, ?, ?, 1)';
      db.query(query, [name, email, hashedPassword, role || 'hospital_admin'], (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        res.status(201).json({
          message: 'Admin registered successfully',
          admin_id: results.insertId,
        });
      });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  },

  // Get All Admins
  getAllAdmins: async (req, res) => {
    try {
      const query = 'SELECT admin_id, name, email, role, is_active FROM admins';
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch admins', error: error.message });
    }
  },

  // Get Admin by ID
  getAdminById: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'SELECT admin_id, name, email, role, is_active FROM admins WHERE admin_id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(results[0]);
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch admin', error: error.message });
    }
  },

  // Update Admin
  updateAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, role, is_active } = req.body;

      const query = 'UPDATE admins SET name = ?, role = ?, is_active = ? WHERE admin_id = ?';
      db.query(query, [name, role, is_active, id], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin updated successfully' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Update failed', error: error.message });
    }
  },
};

module.exports = adminController;
