
const path = require('path');

const Payment = require('../models/Payment');

const {
    createOrder,
    getPaymentStatus
} = require('../services/cashfreeServices');


// Display payment page
exports.getPaymentPage = (req, res) => {
    res.sendFile(
        path.join(__dirname, '../views/payment.html')
    );
};


// Create payment order
exports.processPayment = async (req, res) => {

    const orderId = "ORDER-" + Date.now();

    const orderAmount = 2000;
    const orderCurrency = "INR";

    const customerID = "1";
    const customerPhone = "7976821870";

    try {

        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            customerID,
            customerPhone
        );

        console.log("Payment session: ", paymentSessionId);

        // await Payment.create({
        //     orderId,
        //     paymentSessionId,
        //     orderAmount,
        //     orderCurrency,
        //     paymentStatus: "Pending"
        // });

        return res.status(201).json({
            paymentSessionId,
            orderId
        });

    } catch (error) {

        console.error("Error processing payment:", error);

        return res.status(500).json({
            message: "Error processing payment"
        });
    }
};


// Check payment status
exports.checkPaymentStatus = async (req, res) => {

    try {

        const { orderId } = req.params;

        // const payment = await Payment.findOne({
        //     where: { orderId }
        // });

        // if (!payment) {
        //     return res.status(404).json({
        //         message: "Payment record not found"
        //     });
        // }

        console.log("order id: ", orderId);

        const orderStatus = await getPaymentStatus(orderId);

        console.log("order status: ",orderStatus)

        // await payment.update({
        //     paymentStatus: orderStatus
        // });

        return res.status(200).json({
            orderId,
            orderStatus
        });

    } catch (error) {

        console.error("Error checking payment status:", error);

        return res.status(500).json({
            message: "Unable to check payment status"
        });
    }
};
