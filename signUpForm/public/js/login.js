function handleLoginForm(event) {
    event.preventDefault();

    let form = event.target;

    let user = {
        // name: form.name.value,
        email: form.email.value,
        password: form.password.value
    };

    console.log(user);

    isValidUser(user)
}

async function isValidUser(user) {
    try {
        const result = await axios.post(
            'http://localhost:3000/users/login',
            user
        );

        console.log(result.data);
        alert("user loged in successfully!");
        
        window.location.href = 'http://localhost:3000/expense';
        // display(result.data)

    } catch (error) {
        console.error("Error while Login:", error);

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

