
const cashfree = Cashfree({
    mode: "sandbox"
});

document.getElementById("renderBtn").addEventListener("click", async () => {

    const button = document.getElementById("renderBtn");

    console.log(button)

    try {

        button.disabled = true;

        // Step 1: Create order
        const response = await fetch("http://localhost:3000/payment/pay", {
            method: "POST"
        });

        console.log("response: ", response)

        if (!response.ok) {
            throw new Error("Unable to create payment order");
        }

        const data = await response.json();

        const paymentSessionId = data.paymentSessionId;
        const orderId = data.orderId;

        console.log("data: ",data)

        // Step 2: Configure checkout
        const checkoutOptions = {
            paymentSessionId: paymentSessionId,
            redirectTarget: "_modal"
        };

        // Step 3: Open Cashfree checkout
        const result = await cashfree.checkout(checkoutOptions);

        if (result.error) {
            console.log("Checkout error:", result.error);
            return;
        }

        if (result.redirect) {
            console.log("Payment is being redirected");
            return;
        }

        if (result.paymentDetails) {

            console.log("Checkout completed");

            // Step 4: Verify payment from backend
            const statusResponse = await fetch(
                `http://localhost:3000/payment/payment-status/${orderId}`
            );

            console.log("payStatus: ",statusResponse);

            if (!statusResponse.ok) {
                throw new Error("Unable to fetch payment status");
            }

            const statusData = await statusResponse.json();

            alert("Your payment is " + statusData.orderStatus);

            window.location.href = "http://localhost:3000/premium";
        }

    } catch (error) {

        console.error("Payment error:", error);

        alert(error.message);

    } finally {

        button.disabled = false;
        
    }

});
