const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdminToken } = require('../middleware/auth');

// Public routes
router.post('/login', adminController.loginAdmin);
router.post('/register', adminController.registerAdmin);

// Protected routes
router.get('/all', verifyAdminToken, adminController.getAllAdmins);
router.get('/:id', verifyAdminToken, adminController.getAdminById);
router.put('/:id', verifyAdminToken, adminController.updateAdmin);

module.exports = router;
