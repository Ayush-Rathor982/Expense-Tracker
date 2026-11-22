const Users = require('./Users');
const Expenses = require('./Expenses');
const ForgotPasswordRequests = require('.//forgotPasswordRequest');


//one to many
Users.hasMany(Expenses);
Expenses.belongsTo(Users);

Users.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(Users);


module.exports = {
    Users,
    Expenses,
    ForgotPasswordRequests
}