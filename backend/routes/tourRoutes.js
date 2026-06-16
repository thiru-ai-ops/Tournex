const express = require('express');
const { createTour, getTours, getTourById, updateTour, deleteTour } = require('../controllers/tourController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getTours)
  .post(protect, adminOnly, createTour);

router.route('/:id')
  .get(getTourById)
  .put(protect, adminOnly, updateTour)
  .delete(protect, adminOnly, deleteTour);

module.exports = router;
