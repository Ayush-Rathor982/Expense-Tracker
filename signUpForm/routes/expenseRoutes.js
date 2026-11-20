const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expenseControllers');

router.get('/',expenseController.getExpenses)
router.post('/',expenseController.addExpense);
router.delete('/:id',expenseController.deleteExpense)

module.exports = router;