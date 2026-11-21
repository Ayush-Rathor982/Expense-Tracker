

document.querySelector('#showLeaderboardBtn').addEventListener('click', async () => {
    const leaderboardSection = document.getElementById('leaderboardSection');

    leaderboardSection.removeAttribute('hidden');

    const result = await axios.get('http://localhost:3000/premium/getExpenses');
    
    const users = result.data.users

    console.log(users);

    users.forEach((user,index) => {
        displayLeaderboard(user,index);
    });
});



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
