const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

// Route: POST /api/users/create
// Protected by 'verifyToken' so we know who is making the request
router.post('/create', verifyToken, userController.createSubUser);

module.exports = router;