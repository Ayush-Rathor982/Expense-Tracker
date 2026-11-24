const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premiumController')
const userAuthentication = require('../middleware/auth')


router.get('/getExpenses', premiumController.getLeaderBoardData)
router.get('/getExpenseReport/:period', userAuthentication.authenticate, premiumController.getExpenseReport)

module.exports = router;