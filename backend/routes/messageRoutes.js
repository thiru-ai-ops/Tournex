const express = require('express');
const { getMessages, createMessage, clearMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Secure all message routes

router.route('/')
  .get(getMessages)
  .post(createMessage);

router.delete('/all/clear', clearMessages);

module.exports = router;
