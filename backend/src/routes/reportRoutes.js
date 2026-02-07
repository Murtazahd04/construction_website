const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const verifyToken = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes in this file
// Users must be logged in to view or create reports
router.use(verifyToken);

// 1. GET /api/reports
// Fetch reports with filters (project_id, period, date)
// Example: GET /api/reports?project_id=1&period=month&date=2023-10-01
router.get('/', reportController.getProjectReports);

// 2. POST /api/reports
// Create a new Daily Progress Report (Site Engineers only)
// Body: { project_id, report_date, content }
router.post('/', reportController.createReport);

module.exports = router;