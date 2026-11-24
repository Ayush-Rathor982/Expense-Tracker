const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expenseControllers');
const userAuthentication = require('../middleware/auth')


// router.get('/', userAuthentication.authenticate, expenseController.getExpenses)
router.get('/', expenseController.getExpenses)
// router.get('/totalExpenses', expenseController.getTotalExpensesByUsers)
router.post('/', userAuthentication.authenticate, expenseController.addExpense);
router.post('/predict-category', expenseController.findCategory)
router.delete('/:id', userAuthentication.authenticate, expenseController.deleteExpense)

module.exports = router;