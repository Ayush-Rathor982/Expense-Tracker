function handlePasswordForm(event) {
    event.preventDefault();

    let form = event.target;

    let user = {
        email: form.email.value,
    };

    console.log(user);

    sendPassword(user)
}

async function sendPassword(user) {
    try {
        const result = await axios.post(
            'http://localhost:3000/password/forgotpassword',
            user
        );

        console.log(result);
        if(result.status === 200){
            alert("Password has been send to your email!");
        }
        

        // const token = result.data.token;
        // localStorage.setItem('token', token);

        // console.log("token: ",token)
        
        window.location.href = 'http://localhost:3000/login';
        // display(result.data)

    } catch (error) {
        console.error("Error while Login:", error);

        const status = error.response?.status;

        if (status === 404) {
            alert("Email doesn't exist!");
        }
        else {
            alert(error.response?.data?.message || "Can't Send Password");
        }
    }
}

