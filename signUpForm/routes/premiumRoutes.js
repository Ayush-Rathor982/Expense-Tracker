const express = require('express');
const path = require('path')
const router = express.Router();

const premiumController = require('../controllers/premiumController')
const userAuthentication = require('../middleware/auth')


router.get('/', userAuthentication.isPremium, (req, res) => {
    res.sendFile(path.join(__dirname,"..","views","premium.html"));
});
router.get('/getExpenses', premiumController.getLeaderBoardData)
router.get('/getExpenseReport/:period', userAuthentication.authenticate, premiumController.getExpenseReport)

module.exports = router;