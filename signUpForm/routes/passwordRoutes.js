const express = require('express');
const router = express.Router();
const path = require('path');

const passwordController = require('../controllers/passwordCotroller');
// const userAuthentication = require('../middleware/auth')


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"..","views","forgotPassword.html"));
});
router.post('/forgotpassword', passwordController.getPassword)
// router.post('/', userAuthentication.authenticate, expenseController.addExpense);
// router.post('/predict-category', expenseController.findCategory)
// router.delete('/:id', userAuthentication.authenticate, expenseController.deleteExpense)

module.exports = router;