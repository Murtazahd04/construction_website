const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

// POST /api/materials/request - Create Request
router.post('/request', materialController.createRequest);

// GET /api/materials/my-requests - View Status
router.get('/my-requests', materialController.getMyRequests);

module.exports = router;