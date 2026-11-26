const pageLimit = document.getElementById('page-limit');

// Set default value to 9 or retrieve saved value
pageLimit.value = localStorage.getItem('page-limit') || '9';

// Store selected value whenever it changes
pageLimit.addEventListener('change', () => {
    localStorage.setItem('page-limit', pageLimit.value);

    // console.log("Selected page limit:", pageLimit.value);

    getExpenses();
});



document.addEventListener('DOMContentLoaded', getExpenses);


async function getExpenses(renderPage = 0){
    const token = localStorage.getItem('token');
    const pageLimit = localStorage.getItem('page-limit') || 9;
    const result = await axios.get(`http://localhost:3000/expenses?page=${renderPage}&pageLimit=${pageLimit}`,{headers:{'Authorization' : token}});

    const expenses = result.data.expenses;
    const totalExpense = result.data.totalExpense;

    const expense_ul = document.getElementById('expenseList');
    expense_ul.innerHTML = '';

    expenses.forEach((expense) => {
        display(expense);
    });

    if(totalExpense > pageLimit){
        const pageSection = document.querySelector('#paginationContainer');
        pageSection.innerHTML = ''

        const pages = Math.ceil(totalExpense / pageLimit);

        for(let page = 1; page<=pages; page++){
            const button = document.createElement('button');
            button.id = page;
            button.className = "page_button"
            button.textContent = page;

            button.addEventListener('click',()=>{
                getExpenses(page);
            });

            pageSection.appendChild(button);
        }
    }
}


function handleExpenseForm(event) {
    event.preventDefault();

    let form = event.target;

    let expense = {
        expenseAmount: form.expenseAmount.value,
        note: form.note.value,
        description: form.description.value,
        category: form.category.value
    };

    addData(expense);

}




function display(expense) {
    const ul = document.querySelector('ul');

    const newLi = document.createElement('li');
    newLi.className = 'expense-card';
    newLi.id = expense.id;

    const details = document.createElement('div');
    details.className = 'expense-details';

    const amount = document.createElement('h3');
    amount.textContent = `₹${expense.expenseAmount}`;

    const description = document.createElement('p');
    description.textContent = expense.description;

    const category = document.createElement('span');
    category.className = 'expense-category';
    category.textContent = expense.category;

    details.append(amount, description, category);

    const actions = document.createElement('div');
    actions.className = 'expense-actions';

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';

    delBtn.addEventListener('click', () => {
        deleteData(expense.id, newLi);
    });


    actions.append(delBtn);
    newLi.append(details, actions);

    ul.appendChild(newLi);
}


async function addData(expense) {
    try {
        const token = localStorage.getItem('token');

        const result = await axios.post(
            'http://localhost:3000/expenses',
            expense,
            {headers:{'Authorization' : token}},
        );

        alert("Expense added successfully!");
        
        getExpenses();


    } catch (error) {
        // console.error("Error adding expense:", error);
        alert(error.response?.data?.message || "Failed to add expense");
    }
}


async function deleteData(expenseId, li) {
    
    try {

        const token = localStorage.getItem('token');

        const res = await axios.delete(
            `http://localhost:3000/expenses/${expenseId}`,
            {headers:{'Authorization' : token}}
        )

        if(res.status == 200){
            li.remove()
            alert("Expense deleted successfully!");
            getExpenses();
        }
        
    } catch (error) {
        // console.error("Error deleting expense:", error);
        alert(error.response?.data?.message || "Failed to delete expense");
    }

}

