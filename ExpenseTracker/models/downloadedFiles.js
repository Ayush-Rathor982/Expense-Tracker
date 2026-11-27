const {Sequelize,  DataTypes} = require('sequelize')
const sequelize = require('../utils/db-connection');


const downlodedFiles = sequelize.define('downloaded_files',{
    id:{
        type : DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey : true,
        allowNull : false
    },
    fileURL : {
        type:DataTypes.STRING,
        allowNull:false,
    },
    date:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

module.exports = downlodedFiles;

 