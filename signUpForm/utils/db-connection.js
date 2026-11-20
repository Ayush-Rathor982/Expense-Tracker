const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('expense_tracker_db','root','1234',{
    host : 'localhost',
    dialect : 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been created');
    } catch (error) {
        console.log(error)
    }
})();

module.exports = sequelize;