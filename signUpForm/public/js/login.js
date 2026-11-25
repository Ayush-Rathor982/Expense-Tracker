function handleLoginForm(event) {
    event.preventDefault();

    let form = event.target;

    let user = {
        email: form.email.value,
        password: form.password.value
    };

    isValidUser(user)
}

async function isValidUser(user) {
    try {
        const result = await axios.post(
            'http://localhost:3000/users/login',
            user
        );

        alert("user loged in successfully!");
        
        const isPremium = result.data.isPremium
        const token = result.data.token;
        
        localStorage.setItem('token', token);
        
        if(isPremium){
            window.location.href = 'http://localhost:3000/premium';
        }
        else{
            window.location.href = 'http://localhost:3000/expense';
        }

    } catch (error) {
        // console.error("Error while Login:", error);

        const status = error.response?.status;

        if (status === 404) {
            alert("Email doesn't exist!");
        }
        else if (status === 401) {
            alert("Incorrect Password!");
        }
        else {
            alert(error.response?.data?.message || "Login Failed");
        }
    }
}

