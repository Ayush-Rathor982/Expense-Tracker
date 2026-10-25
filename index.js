
function handleSubmit(event) {
    event.preventDefault();

    let form = event.target;

    let editId = sessionStorage.getItem('editId');

    let expense = {
        id: editId || Date.now().toString(),
        expenseAmount: form.expenseAmount.value,
        description: form.description.value,
        category: form.category.value
    };

    let expenses = JSON.parse(localStorage.getItem("expenseList")) || [];

    if (editId) {
        update(expenses, editId, expense);
    } else {
        addData(expenses, expense);
    }

    localStorage.setItem("expenseList", JSON.stringify(expenses));
}


function display(expense) {
    let ul = document.querySelector('ul');
    let newLi = document.createElement('li');

    newLi.id = expense.id;

    newLi.textContent =
        expense.expenseAmount + " - " + expense.description + " - " + expense.category;

    let delBtn = document.createElement('button');
    delBtn.textContent = "Delete Expense";

    let editBtn = document.createElement('button');
    editBtn.textContent = "Edit Expense";

    editBtn.addEventListener('click', () => {
        editData(expense);
    });

    delBtn.addEventListener('click', () => {
        deleteData(expense.id, newLi);
    });

    newLi.appendChild(delBtn);
    newLi.appendChild(editBtn);

    ul.appendChild(newLi);
}


function addData(expenses, expense) {
    expenses.push(expense);
    display(expense);
}


function deleteData(expenseId, li) {
    let expenses = JSON.parse(localStorage.getItem('expenseList')) || [];

    let newExpenses = [];

    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].id === expenseId) continue;

        newExpenses.push(expenses[i]);
    }

    localStorage.setItem('expenseList', JSON.stringify(newExpenses));

    li.remove();
}


function editData(expense) {
    const expenseAmountInput = document.querySelector("#expenseAmount");
    const descriptionInput = document.querySelector("#description");
    const categoryInput = document.querySelector("#category");

    expenseAmountInput.value = expense.expenseAmount;
    descriptionInput.value = expense.description;
    categoryInput.value = expense.category;

    sessionStorage.setItem('editId', expense.id);

    let addExpenseBtn = document.querySelector('button[type=submit]');
    addExpenseBtn.textContent = "Update Expense";
}


function update(expenses, editId, expense) {
    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].id === editId) {
            expenses[i].expenseAmount = expense.expenseAmount;
            expenses[i].description = expense.description;
            expenses[i].category = expense.category;
            break;
        }
    }

    let li = document.getElementById(editId);

    li.firstChild.textContent =
        expense.expenseAmount + " - " + expense.description + " - " + expense.category;

    sessionStorage.removeItem("editId");

    let addExpenseBtn = document.querySelector('button[type=submit]');
    addExpenseBtn.textContent = "Add Expense";
}

module.exports = handleSubmit;