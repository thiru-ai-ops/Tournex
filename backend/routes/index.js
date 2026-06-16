const express = require('express');
const authRoutes = require('./authRoutes');
const tourRoutes = require('./tourRoutes');
const bookingRoutes = require('./bookingRoutes');
const expenseRoutes = require('./expenseRoutes');
const messageRoutes = require('./messageRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tours', tourRoutes);
router.use('/bookings', bookingRoutes);
router.use('/expenses', expenseRoutes);
router.use('/messages', messageRoutes);
router.use('/users', userRoutes);

module.exports = router;

