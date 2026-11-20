const {Sequelize,  DataTypes} = require('sequelize')
const sequelize = require('../utils/db-connection');


const expenses = sequelize.define('expenses',{
    id:{
        type : DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey : true,
        allowNull : false
    },
    expenseAmount : {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    description : {
        type:DataTypes.TEXT,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

module.exports = expenses;

 