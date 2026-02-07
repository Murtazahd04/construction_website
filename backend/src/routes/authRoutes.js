const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route: POST /api/auth/register-company
router.post('/register-company', authController.registerCompany);

// Route: POST /api/auth/admin/approve-company
// Note: In a real app, this should be protected by an Admin Middleware
router.post('/admin/approve-company', authController.approveCompany);
router.post('/login', authController.login); // New Route [cite: 29]
module.exports = router;