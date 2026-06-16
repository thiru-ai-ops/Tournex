const express = require('express');
const { getExpenses, createExpense, deleteExpense, clearExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Secure all expense routes

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.delete('/all/clear', clearExpenses);

router.route('/:id')
  .delete(deleteExpense);

module.exports = router;
