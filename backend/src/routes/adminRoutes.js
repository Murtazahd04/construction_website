const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const  verifyToken  = require('../middlewares/authMiddleware'); // Ensure path is correct

// Protect routes
router.use(verifyToken);

router.get('/registrations', adminController.getPendingRegistrations);
router.post('/approve/:id', adminController.approveCompany);
router.post('/reject/:id', adminController.rejectCompany);

module.exports = router;