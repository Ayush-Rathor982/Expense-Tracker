
const express = require('express');
const router = express.Router();

const {
    getPaymentPage,
    processPayment,
    checkPaymentStatus
} = require('../controllers/paymentController');

// Display payment page
router.get('/payment', getPaymentPage);

// Create payment order
router.post('/pay', processPayment);

// Check payment status
router.get('/payment-status/:orderId', checkPaymentStatus);

module.exports = router;
