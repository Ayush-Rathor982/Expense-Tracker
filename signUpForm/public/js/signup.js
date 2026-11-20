
// document.addEventListener('DOMContentLoaded', async () => {
//     const expenses = await axios.get('http://localhost:3000/expenses');

//     for(let i=0; i<expenses.data.length; i++){
//         display(expenses.data[i]);
//     }
// })


function handleSignUpForm(event) {
    event.preventDefault();

    let form = event.target;

    // console.log(form)

    // let editId = sessionStorage.getItem('editId');

    let user = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value
    };

    console.log(user);

    addUser(user);

    // let expenses = JSON.parse(localStorage.getItem("expenseList")) || [];

    // if (editId) {
    //     update(expenses, editId, expense);
    // } else {
    //     addData(expenses, expense);
    // }

    // localStorage.setItem("expenseList", JSON.stringify(expenses));
}


async function addUser(user) {
    try {
        const result = await axios.post(
            'http://localhost:3000/users/signup',
            user
        );

        console.log(result.data);
        alert("user signUp successfully!");
        // display(result.data)

    } catch (error) {
        console.error("Error while signup:", error);
        alert(error.response?.data?.message || "SignUp Failed");
    }
}


// function display(expense) {
//     let ul = document.querySelector('ul');
//     let newLi = document.createElement('li');

//     newLi.id = expense.id;

//     newLi.textContent =
//         expense.expenseAmount + " - " + expense.description + " - " + expense.category;

//     let delBtn = document.createElement('button');
//     delBtn.textContent = "Delete Expense";

//     let editBtn = document.createElement('button');
//     editBtn.textContent = "Edit Expense";

//     editBtn.addEventListener('click', () => {
//         editData(expense);
//     });

//     delBtn.addEventListener('click', () => {
//         deleteData(expense.id, newLi);
//     });

//     newLi.appendChild(delBtn);
//     newLi.appendChild(editBtn);

//     ul.appendChild(newLi);
// }


// async function addData(expense) {
//     // expenses.push(expense);
//     // display(expense);

//     const result = await axios.post('http://localhost:3000/expenses',expense);

//     console.log(result.data);
// }




// function display(expense) {
//     const ul = document.querySelector('ul');

//     const newLi = document.createElement('li');
//     newLi.className = 'expense-card';
//     newLi.id = expense.id;

//     const details = document.createElement('div');
//     details.className = 'expense-details';

//     const amount = document.createElement('h3');
//     amount.textContent = `₹${expense.expenseAmount}`;

//     const description = document.createElement('p');
//     description.textContent = expense.description;

//     const category = document.createElement('span');
//     category.className = 'expense-category';
//     category.textContent = expense.category;

//     details.append(amount, description, category);

//     const actions = document.createElement('div');
//     actions.className = 'expense-actions';

//     const delBtn = document.createElement('button');
//     delBtn.textContent = 'Delete';
//     delBtn.className = 'delete-btn';

//     delBtn.addEventListener('click', () => {
//         deleteData(expense.id, newLi);
//     });

//     // const editBtn = document.createElement('button');
//     // editBtn.textContent = 'Edit';
//     // editBtn.className = 'edit-btn';

//     // editBtn.addEventListener('click', () => {
//     //     editData(expense);
//     // });

//     // actions.append(editBtn);

//     actions.append(delBtn);
//     newLi.append(details, actions);

//     ul.appendChild(newLi);
// }




// async function deleteData(expenseId, li) {
    
//     try {

//         const res = await axios.delete(`http://localhost:3000/expenses/${expenseId}`)

//         if(res.status == 200){
//             li.remove()
//             alert("Expense deleted successfully!");
//         }
        
//     } catch (error) {
//         console.error("Error deleting expense:", error);
//         alert(error.response?.data?.message || "Failed to delete expense");
//     }

// }


// function editData(expense) {
//     const expenseAmountInput = document.querySelector("#expenseAmount");
//     const descriptionInput = document.querySelector("#description");
//     const categoryInput = document.querySelector("#category");

//     expenseAmountInput.value = expense.expenseAmount;
//     descriptionInput.value = expense.description;
//     categoryInput.value = expense.category;

//     sessionStorage.setItem('editId', expense.id);

//     let addExpenseBtn = document.querySelector('button[type=submit]');
//     addExpenseBtn.textContent = "Update Expense";
// }


// function update(expenses, editId, expense) {
//     for (let i = 0; i < expenses.length; i++) {
//         if (expenses[i].id === editId) {
//             expenses[i].expenseAmount = expense.expenseAmount;
//             expenses[i].description = expense.description;
//             expenses[i].category = expense.category;
//             break;
//         }
//     }

//     let li = document.getElementById(editId);

//     li.firstChild.textContent =
//         expense.expenseAmount + " - " + expense.description + " - " + expense.category;

//     sessionStorage.removeItem("editId");

//     let addExpenseBtn = document.querySelector('button[type=submit]');
//     addExpenseBtn.textContent = "Add Expense";
// }

module.exports = handleSubmit;