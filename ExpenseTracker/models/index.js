const Users = require('./Users');
const Expenses = require('./Expenses');
const ForgotPasswordRequests = require('.//forgotPasswordRequest');
const DownloadedFiles = require('./downloadedFiles')


//one to many
Users.hasMany(Expenses);
Expenses.belongsTo(Users);

Users.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(Users);

Users.hasMany(DownloadedFiles);
DownloadedFiles.belongsTo(Users);


module.exports = {
    Users,
    Expenses,
    ForgotPasswordRequests,
    DownloadedFiles
}