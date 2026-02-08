const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register-company', authController.registerCompany);
router.post('/admin/approve-company', authController.approveCompany);
router.post('/login', authController.login); // New Route [cite: 29]

module.exports = router;