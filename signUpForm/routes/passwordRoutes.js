const express = require('express');
const router = express.Router();
const path = require('path');

const passwordController = require('../controllers/forgotPasswordController');


router.get('/forgotpassword', (req, res) => {
    res.sendFile(path.join(__dirname,"..","views","forgotPassword.html"));
});
router.get('/resetpassword/:id',passwordController.getResetPasswordPage)
router.post('/forgotpassword', passwordController.forgotPassword)
router.post('/updatepassword/:id',passwordController.updatePassword)
// router.post('/', userAuthentication.authenticate, expenseController.addExpense);
// router.post('/predict-category', expenseController.findCategory)
// router.delete('/:id', userAuthentication.authenticate, expenseController.deleteExpense)

module.exports = router;