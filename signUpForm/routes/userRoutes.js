const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');

// router.get('/',expenseController.getExpenses)
router.post('/',userController.addUser);
// router.delete('/:id',expenseController.deleteExpense)

module.exports = router;