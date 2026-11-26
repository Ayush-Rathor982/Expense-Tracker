const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');

router.post('/signup',userController.addUser);
router.post('/login',userController.checkUser);

module.exports = router;