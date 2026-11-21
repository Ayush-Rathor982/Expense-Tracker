const Users = require('./Users');
const Expenses = require('./Expenses');


//one to many
Users.hasMany(Expenses);
Expenses.belongsTo(Users);


module.exports = {
    Users,
    Expenses
}