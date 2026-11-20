
document.addEventListener('DOMContentLoaded', async () => {
    const expenses = await axios.get('http://localhost:3000/expenses');

    for(let i=0; i<expenses.data.length; i++){
        display(expenses.data[i]);
    }
})


function handleExpenseForm(event) {
    event.preventDefault();

    let form = event.target;

    let editId = sessionStorage.getItem('editId');

    let expense = {
        // id: editId || Date.now().toString(),
        expenseAmount: form.expenseAmount.value,
        description: form.description.value,
        category: form.category.value
    };

    console.log(expense);

    addData(expense);

    // let expenses = JSON.parse(localStorage.getItem("expenseList")) || [];

    // if (editId) {
    //     update(expenses, editId, expense);
    // } else {
    //     addData(expenses, expense);
    // }

    // localStorage.setItem("expenseList", JSON.stringify(expenses));
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
        const result = await axios.post(
            'http://localhost:3000/expenses',
            expense
        );

        console.log(result.data);
        alert("Expense added successfully!");
        display(result.data)

    } catch (error) {
        console.error("Error adding expense:", error);
        alert(error.response?.data?.message || "Failed to add expense");
    }
}


async function deleteData(expenseId, li) {
    
    try {

        const res = await axios.delete(`http://localhost:3000/expenses/${expenseId}`)

        if(res.status == 200){
            li.remove()
            alert("Expense deleted successfully!");
        }
        
    } catch (error) {
        console.error("Error deleting expense:", error);
        alert(error.response?.data?.message || "Failed to delete expense");
    }

}


module.exports = handleSubmit;