const Users = require('../models/Users')
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

    const customerID = String(req.user.id);
    const customerPhone = "7976821870";

    try {

        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            customerID,
            customerPhone
        );

        await Payment.create({
            orderId,
            orderAmount,
            orderCurrency,
            paymentSessionId,
            paymentStatus : "Pending",
            customerId : req.user.id,
        });

        return res.status(201).json({
            paymentSessionId,
            orderId
        });

    } catch (error) {

        // console.error("Error processing payment:", error);

        return res.status(500).json({
            message: "Error processing payment"
        });
    }
};


// Check payment status
exports.checkPaymentStatus = async (req, res) => {

    try {

        const { orderId } = req.params;

        const userId = req.user.id

        const payment = await Payment.findOne({
            where:{
                orderId : orderId
            }
        })

        const orderStatus = await getPaymentStatus(orderId);

        payment.paymentStatus = orderStatus;
        await payment.save();

        
        // Upgrade only when payment is successful
        if (orderStatus === 'Success') {
            const user = await Users.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            user.isPremium = true;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Payment successful. Premium activated!",
                orderId,
                orderStatus
            });
        }

        return res.status(200).json({
            success: false,
            message: "Payment not completed yet",
            orderId,
            orderStatus
        });

    } catch (error) {

        // console.error("Error checking payment status:", error);

        return res.status(500).json({
            message: "Unable to check payment status"
        });
    }
};
