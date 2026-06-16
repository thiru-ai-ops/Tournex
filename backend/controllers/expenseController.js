const { db } = require('../config/firebase');

/**
 * @desc    Get user expenses
 * @route   GET /api/expenses
 * @access  Private
 */
const getExpenses = async (req, res, next) => {
  try {
    const expensesSnap = await db.collection('users')
      .doc(req.user.uid)
      .collection('expenses')
      .orderBy('createdAt', 'desc')
      .get();

    const expenses = [];
    expensesSnap.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: { expenses },
      message: 'Expenses fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new expense
 * @route   POST /api/expenses
 * @access  Private
 */
const createExpense = async (req, res, next) => {
  try {
    const { description, amount, paidBy, splitWith, category, date } = req.body;

    if (!description || amount === undefined || !paidBy || !category || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required expense fields' 
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Expense amount cannot be negative' 
      });
    }

    const expenseData = {
      description,
      amount: Number(amount),
      paidBy,
      splitWith: splitWith || [],
      category,
      date,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('users')
      .doc(req.user.uid)
      .collection('expenses')
      .add(expenseData);

    res.status(201).json({
      success: true,
      data: {
        expense: {
          id: docRef.id,
          ...expenseData
        }
      },
      message: 'Expense created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
const deleteExpense = async (req, res, next) => {
  try {
    const expenseRef = db.collection('users')
      .doc(req.user.uid)
      .collection('expenses')
      .doc(req.params.id);
      
    const expenseSnap = await expenseRef.get();

    if (!expenseSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found' 
      });
    }

    await expenseRef.delete();

    res.json({ 
      success: true, 
      data: {}, 
      message: 'Expense removed successfully' 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all user expenses
 * @route   DELETE /api/expenses/all/clear
 * @access  Private
 */
const clearExpenses = async (req, res, next) => {
  try {
    const expensesRef = db.collection('users')
      .doc(req.user.uid)
      .collection('expenses');
      
    const expensesSnap = await expensesRef.get();

    const batch = db.batch();
    expensesSnap.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.json({ 
      success: true, 
      data: {}, 
      message: 'All user expenses cleared successfully' 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
  clearExpenses
};
