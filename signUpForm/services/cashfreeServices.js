
const { Cashfree, CFEnvironment } = require('cashfree-pg');

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_CLIENT_ID,
    process.env.CASHFREE_CLIENT_SECRET
);

const API_VERSION = "2023-08-01";

exports.createOrder = async (
    orderId,
    orderAmount,
    orderCurrency = "INR",
    customerId,
    customerPhone
) => {
    try {
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

        const request = {
            order_amount: orderAmount,
            order_currency: orderCurrency,
            order_id: orderId,

            customer_details: {
                customer_id: customerId,
                customer_phone: customerPhone
            },

            order_meta: {
                return_url: `http://localhost:3000/payment/return?order_id={order_id}`,
                payment_methods: "cc,dc,upi,nb"
            },

            order_expiry_time: expiryDate.toISOString()
        };

        const response = await cashfree.PGCreateOrder(request);

        return response.data.payment_session_id;

    } catch (error) {
        console.error(
            "Error creating Cashfree order:",
            error.response?.data || error.message
        );

        throw error;
    }
};


exports.getPaymentStatus = async (orderId) => {
    try {
        const response = await cashfree.PGOrderFetchPayments(
            API_VERSION,
            orderId
        );

        const payments = response.data;

        let orderStatus = "Failure";

        if (payments.some(payment => payment.payment_status === "SUCCESS")) {
            orderStatus = "Success";
        } else if (
            payments.some(payment => payment.payment_status === "PENDING")
        ) {
            orderStatus = "Pending";
        }

        return orderStatus;

    } catch (error) {
        console.error(
            "Error fetching payment status:",
            error.response?.data || error.message
        );

        throw error;
    }
};
