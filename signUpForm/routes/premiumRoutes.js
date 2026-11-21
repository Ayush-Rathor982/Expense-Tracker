const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premiumController')


router.get('/getExpenses', premiumController.getLeaderBoardData)

module.exports = router;