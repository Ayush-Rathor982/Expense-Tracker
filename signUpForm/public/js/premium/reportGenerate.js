const tabs = document.querySelectorAll('.transaction-tabs .tab');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {

        // Remove active class from all buttons
        tabs.forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        tab.classList.add('active');

        // Get selected period
        const period = tab.dataset.type;
        console.log(period);

        const periodHeading = document.getElementById('periodHeading');

        if (period === 'daily') {
            periodHeading.textContent = 'Date';
        }
        else if (period === 'weekly') {
            periodHeading.textContent = 'Week';
        }
        else if (period === 'monthly') {
            periodHeading.textContent = 'Month';
        }

        const pageSection = document.querySelector('#paginationContainer');
        pageSection.innerHTML = "";

        getExpenseReport(period);

    });
});



document.addEventListener('DOMContentLoaded', () => {
    getExpenseReport();
})



async function getExpenseReport(period = 'daily', renderPage = 0) {
    try {
        const token = localStorage.getItem('token');

        const result = await axios.get(
            `http://localhost:3000/premium/getExpenseReport/${period}?page=${renderPage}`,
            {headers:{'Authorization' : token}}
        );

        console.log(result.data);

        const expenses = result.data.expenses;
        const totalExpense = result.data.totalExpense;

        // Clear previous rows before displaying new data
        const table = document.getElementById('transactionTable');
        table.innerHTML = '';

        expenses.forEach((expense,index) => {
            displayReport(expense, index+1, renderPage==0 ? 1:renderPage, period);
        });


        if(totalExpense>10){
            const pageSection = document.querySelector('#paginationContainer');
            pageSection.innerHTML = ""

            const pages = Math.ceil(totalExpense / 10);

            for(let page = 1; page<=pages; page++){
                const button = document.createElement('button');
                button.id = page;
                button.className = "page_button"
                button.textContent = page;

                button.addEventListener('click',()=>{
                    getExpenseReport(period, page);
                });

                pageSection.appendChild(button);
            }
        }


    } catch (error) {
        console.error('Error fetching expense report:', error);
    }
}


function displayReport(expense,index,page,period) {

    const table = document.getElementById('transactionTable');

    // Create table row
    const tr = document.createElement('tr');
    
    const SNo = document.createElement('td');
    SNo.textContent = Number((page-1)*10 + index);

    // Create category cell
    const categoryTd = document.createElement('td');
    categoryTd.textContent = expense.category;

    // Create period/date cell
    const dateTd = document.createElement('td');
    dateTd.textContent = formatPeriod(expense.period, period);

    // Create amount cell
    const amountTd = document.createElement('td');
    amountTd.classList.add('amount', 'income-amount');
    amountTd.textContent =
        `₹${Number(expense.totalExpense).toLocaleString('en-IN')}`;

    // Append cells to row
    tr.appendChild(SNo)
    tr.appendChild(categoryTd);
    tr.appendChild(dateTd);
    tr.appendChild(amountTd);

    // Append row to table
    table.appendChild(tr);
}




function formatPeriod(periodValue, period) {

    if (period === 'daily') {
        return periodValue; // 2026-11-15
    }

    if (period === 'monthly') {
        const [year, month] = periodValue.split('-');

        const date = new Date(Number(year), Number(month) - 1);

        return date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    }

    if (period === 'weekly') {

        const year = Number(periodValue.toString().substring(0, 4));
        const week = Number(periodValue.toString().substring(4));

        // Find Monday of the requested ISO week
        const jan4 = new Date(year, 0, 4);
        const monday = new Date(jan4);

        monday.setDate(
            jan4.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7
        );

        const month = monday.toLocaleDateString('en-US', {
            month: 'short'
        });

        function ordinal(n) {
            if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;

            switch (n % 10) {
                case 1: return `${n}st`;
                case 2: return `${n}nd`;
                case 3: return `${n}rd`;
                default: return `${n}th`;
            }
        }

        // Calculate which week of the month the Monday belongs to
        const weekOfMonth = Math.ceil(monday.getDate() / 7);

        return `${ordinal(weekOfMonth)} week ${month} ${year}`;
    }

    return periodValue;
}
