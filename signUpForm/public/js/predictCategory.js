
const descriptionInput = document.getElementById('description');
const categorySelect = document.getElementById('category');

let debounceTimer;

descriptionInput.addEventListener('input', () => {

    clearTimeout(debounceTimer);

    const description = descriptionInput.value.trim();

    if (description.length < 3) {
        return;
    }

    // Wait until the user stops typing
    debounceTimer = setTimeout(async () => {

        try {

            console.log("description: ", description);
            const response = await fetch(
                'http://localhost:3000/expenses/predict-category',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ description })
                }
            );

            const data = await response.json();

            console.log("gemini data: ", data);

            if (response.ok) {
                categorySelect.value = data.category;
            }

        } catch (error) {
            console.error('Category prediction failed:', error);
        }

    }, 800);

});
