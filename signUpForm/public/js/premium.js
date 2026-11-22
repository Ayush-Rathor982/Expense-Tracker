

document.querySelector('#showLeaderboardBtn').addEventListener('click', updateLeaderBoard);

async function updateLeaderBoard(){
    console.log("called...")

    const leaderboardSection = document.getElementById('leaderboardSection');

    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    leaderboardSection.removeAttribute('hidden');

    const result = await axios.get('http://localhost:3000/premium/getExpenses');
    
    const users = result.data.users

    console.log(users);

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

    console.log(row);

    // Append row to table body
    leaderboardBody.appendChild(row);

}









document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const expenses = await axios.get('http://localhost:3000/expenses',{headers:{'Authorization' : token}});

    console.log("Get Premium data: ",expenses.data)

    for(let i=0; i<expenses.data.length; i++){
        display(expenses.data[i]);
    }
})


function handleExpenseForm(event) {
    event.preventDefault();

    let form = event.target;

    let expense = {
        // id: editId || Date.now().toString(),
        expenseAmount: form.expenseAmount.value,
        description: form.description.value,
        category: form.category.value
    };

    console.log("expense data before adding: ",expense);

    addData(expense);

    updateLeaderBoard();

    // let expenses = JSON.parse(localStorage.getItem("expenseList")) || [];

    // if (editId) {
    //     update(expenses, editId, expense);
    // } else {
    //     addData(expenses, expense);
    // }

    // localStorage.setItem("expenseList", JSON.stringify(expenses));
}




function display(expense) {
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

    // const editBtn = document.createElement('button');
    // editBtn.textContent = 'Edit';
    // editBtn.className = 'edit-btn';

    // editBtn.addEventListener('click', () => {
    //     editData(expense);
    // });

    // actions.append(editBtn);

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

        console.log("expense data After adding: ",result.data.expense);
        alert("Expense added successfully!");
        display(result.data.expense)

    } catch (error) {
        console.error("Error adding expense:", error);
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
        }
        
    } catch (error) {
        console.error("Error deleting expense:", error);
        alert(error.response?.data?.message || "Failed to delete expense");
    }

}


// module.exports = handleSubmit;