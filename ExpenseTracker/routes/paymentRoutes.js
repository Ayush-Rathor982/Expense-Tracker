
const express = require('express');
const router = express.Router();
const userAuthentication = require('../middleware/auth')

const {
    getPaymentPage,
    processPayment,
    checkPaymentStatus
} = require('../controllers/paymentController');

// Display payment page
router.get('/', getPaymentPage);

// Create payment order
router.post('/pay', userAuthentication.authenticate, processPayment);

// Check payment status
router.get('/payment-status/:orderId', userAuthentication.authenticate, checkPaymentStatus);

module.exports = router;
