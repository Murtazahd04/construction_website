const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyToken = require('../middlewares/authMiddleware');

// Middleware: All project routes require a logged-in user
router.use(verifyToken);

// POST /api/projects/create - Create a new project
router.post('/create', projectController.createProject);

// POST /api/projects/assign - Assign a contractor to a project
router.post('/assign', projectController.assignContractor);

// GET /api/projects/contractors - List contractors available for assignment
router.get('/contractors', projectController.getAvailableContractors);

// GET /api/projects/list - List projects for the PM Dashboard
router.get('/list', projectController.getMyProjects);

// Add this route
router.get('/owner/list', projectController.getOwnerProjects);
// Add this route
router.get('/:projectId/team', projectController.getProjectTeam);
module.exports = router;