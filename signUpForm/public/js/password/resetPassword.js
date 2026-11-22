const form = document.getElementById('resetForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password1 =
        document.getElementById('password1').value;

    const password2 =
        document.getElementById('password2').value;

    if(password1 !== password2){
        alert('Passwords not matching. Enter the correct passwords!');
        return;
    }

    // Extract UUID from current URL
    const id = window.location.pathname.split('/').pop();

    console.log("reset id: ",id)

    try {
        const response = await fetch(
            `/password/updatepassword/${id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password : password1 })
            }
        );

        const result = await response.json();

        alert('Password updated Successfully!');

        document.getElementById('message').innerText =
            result.message;

    } catch (error) {
        console.error(error);
    }
});