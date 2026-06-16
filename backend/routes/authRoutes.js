const express = require('express');
const { registerUser, loginUser, getCurrentUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getCurrentUserProfile);

module.exports = router;
