const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expenseControllers');
const downloadedFiles = require('../controllers/downloadListController');
const userAuthentication = require('../middleware/auth')


router.get('/', userAuthentication.authenticate, expenseController.getExpenses)
router.post('/', userAuthentication.authenticate, expenseController.addExpense);
router.post('/predict-category', expenseController.findCategory)
router.delete('/:id', userAuthentication.authenticate, expenseController.deleteExpense)
router.get('/download', userAuthentication.authenticate, expenseController.downloadExpenses)
router.get('/downloadedFiles',userAuthentication.authenticate, downloadedFiles.getDownloadedList)

module.exports = router;