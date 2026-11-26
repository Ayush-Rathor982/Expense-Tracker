

document.querySelector('#showLeaderboardBtn').addEventListener('click', updateLeaderBoard);

async function updateLeaderBoard(){

    const leaderboardSection = document.getElementById('leaderboardSection');

    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    leaderboardSection.removeAttribute('hidden');


    const result = await axios.get('http://localhost:3000/premium/getExpenses');
    
    const users = result.data.users

    users.forEach((user,index) => {
        displayLeaderboard(user,index);
    });
}



function displayLeaderboard(user,index) {

    const leaderboardBody = document.getElementById('leaderboardBody');

    // leaderboardBody.innerHTML = '';


    const row = document.createElement('tr');

    // Rank column
    const rankTd = document.createElement('td');

    const rankSpan = document.createElement('span');
    rankSpan.classList.add('rank');

    if (index === 0) {
        rankSpan.classList.add('first');
    } else if (index === 1) {
        rankSpan.classList.add('second');
    } else if (index === 2) {
        rankSpan.classList.add('third');
    }

    rankSpan.textContent = `#${index + 1}`;
    rankTd.appendChild(rankSpan);


    // User column
    const userTd = document.createElement('td');

    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');

    const userAvatar = document.createElement('div');
    userAvatar.classList.add('user-avatar');

    const name = user.name || 'Unknown';
    userAvatar.textContent = name.charAt(0).toUpperCase();

    const userName = document.createElement('span');
    userName.classList.add('user-name');
    userName.textContent = name;

    userInfo.appendChild(userAvatar);
    userInfo.appendChild(userName);

    userTd.appendChild(userInfo);


    // Total expense column
    const expenseTd = document.createElement('td');

    const expenseSpan = document.createElement('span');
    expenseSpan.classList.add('expense-amount');

    expenseSpan.textContent =
        `₹${Number(user.totalExpense || 0).toLocaleString('en-IN')}`;

    expenseTd.appendChild(expenseSpan);


    // Append all td elements to the row
    row.appendChild(rankTd);
    row.appendChild(userTd);
    row.appendChild(expenseTd);

    // Append row to table body
    leaderboardBody.appendChild(row);

}







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
        displayExpense(expense);
    });

    if(totalExpense > pageLimit){
        const pageSection = document.querySelector('#paginationContainerExpenses');
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


function displayExpense(expense) {

    const ul = document.querySelector('#expenseList');

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


function handleExpenseForm(event) {
    event.preventDefault();

    let form = event.target;

    let expense = {
        expenseAmount: form.expenseAmount.value,
        description: form.description.value,
        note: form.note.value,
        category: form.category.value
    };

    addData(expense);

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
        getExpenseReport();

        const leaderboardSection = document.getElementById('leaderboardSection');

        if(!leaderboardSection.hasAttribute('hidden')){
            updateLeaderBoard();
        }

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
            getExpenseReport();

            const leaderboardSection = document.getElementById('leaderboardSection');

            if(!leaderboardSection.hasAttribute('hidden')){
                updateLeaderBoard();
            }
        }
        
    } catch (error) {
        // console.error("Error deleting expense:", error);
        alert(error.response?.data?.message || "Failed to delete expense");
    }

}


// module.exports = handleSubmit;