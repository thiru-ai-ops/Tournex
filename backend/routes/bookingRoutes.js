const express = require('express');
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Secure all booking endpoints

router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/', adminOnly, getAllBookings);

module.exports = router;
