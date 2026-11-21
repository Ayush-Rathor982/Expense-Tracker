const cashfree = Cashfree({
    mode: "sandbox",
});


document.getElementById("renderBtn").addEventListener("click", async () => {
    
    try{
        const response = await fetch("http://localhost:3000/payment/pay",{
            method:"POST",
        });

        const data = await response.json();
        const paymentSessionId = data.paymentSessionId;

        let checkoutOptions = {
            paymentSessionId: paymentSessionId,

            redirectTarget: document.getElementById("cf_checkout"),
            appearance:{
                width : "325px",
                height : "325px",
            }
        };

        
        const result = await cashfree.checkout(checkoutOptions);

        if(result.error){
            console.log("user has closed the popup or there is some payment error")
            console.log(result.error);
        }
        if(result.redirect){
            console.log("payment will be redirected");
        }
        if(result.paymentDetails){
            console.log("Payment has been completed, Check for Payment Status");
            console.log(result.paymentDetails.paymentMessage);

            const response = await fetch(`http://localhost:3000/payment/payment-status/${orderId}`,{
                method: "GET",
            });

            const data = await response.json();

            alert("Your payment is "+data.orderStatus)
        }

    }
    catch(error){
        console.log("Error: ",error)
    }

    
    
});