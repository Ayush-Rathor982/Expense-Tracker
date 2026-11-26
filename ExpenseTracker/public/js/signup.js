
function handleSignUpForm(event) {
    event.preventDefault();

    let form = event.target;

    let user = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value
    };

    signUp(user);

}


async function signUp(user) {
    try {
        const result = await axios.post(
            'http://localhost:3000/users/signup',
            user
        );

        alert("user signUp successfully!");

        window.location.href = 'http://localhost:3000/login'

    } catch (error) {
        // console.error("Error while signup:", error);
        alert(error.response?.data?.message || "SignUp Failed");
    }
}

