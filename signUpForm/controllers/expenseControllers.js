const { Sequelize } = require('sequelize');
const Expenses = require('../models/Expenses')
const Users = require('../models/Users')
const predictCategory = require('../services/geminiService');
const sequelize = require('../utils/db-connection');



async function executeExpensesQuery(limit,offset,userId){
    const expenses = await Expenses.findAll({
        where : {
            UserId : userId
        },
        limit,
        offset,
    });

    return expenses;
}

const getExpenses = async (req,res,next) => {
    try {       

        const userId = req.user.id
        // const userId = 1

        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.pageLimit);
        const offset = page === 0 ? 0 : (page - 1) * limit;


        let expenses = await executeExpensesQuery(
            page === 0 ? Number.MAX_SAFE_INTEGER : limit,
            offset,
            userId
        ); 


        const totalExpenses = expenses.length;
        if(totalExpenses > limit){
            expenses = expenses.slice(0, limit);
        }

        if(expenses.length === 0){
            //  return res.status(404).send("expense not found");
            const err = new Error("expense not found");
            err.statusCode = 404;

            return next(err);
        }

        return res.status(200).json({
            success: true,
            expenses,
            totalExpense : totalExpenses
        });

    } catch (error) {
        // res.status(500).send("Error while fetching ",error.message);
        const err = new Error("Error while fetching ",error.message);
        err.statusCode = 500;

        return next(err);
    }
}


const addExpense = async (req, res, next) => {

    try {

        const transaction = await sequelize.transaction();

        const expense = await Expenses.create({
            ...req.body,
            UserId: req.user.id
        },
        {transaction});

        if (!expense) {
            // return res.status(400).json({
            //     success: false,
            //     message: "Expense not added"
            // });
            const err = new Error("Expense not added ");
            err.statusCode = 400;

            return next(err);
        }

        const user = await Users.findByPk(req.user.id,{transaction});

        if (!user) {
            await transaction.rollback();
            // return res.status(404).json({
            //     success: false,
            //     message: "User not found"
            // });
            const err = new Error("User not found, ");
            err.statusCode = 404;

            return next(err);
        }

        user.totalExpense += Number(expense.expenseAmount);

        await user.save({transaction});

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense
        });

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        // return res.status(500).json({
        //     success: false,
        //     message: "Error while inserting expense",
        //     error: error.message
        // });
        const err = new Error("Error while inserting expense, ",error.message);
        err.statusCode = 500;

        return next(err);
    }
};



const deleteExpense = async (req,res,next) => {
    try {

        const transaction = await sequelize.transaction();
        
        const {id} = req.params; 

        const expense = await Expenses.findOne({
            where : {
                id : id,
                UserId: req.user.id
            },
            transaction
        });

        if(!expense){
            await transaction.rollback();
            // return res.status(404).send("expense not added");
            const err = new Error("expense not added");
            err.statusCode = 404;

            return next(err);
        }
        
        await Expenses.destroy({
            where : {
                id : id,
                UserId: req.user.id
            }, 
            transaction
        });


        const user = await Users.findByPk(req.user.id,{transaction});

        if (!user) {
            await transaction.rollback();
            // return res.status(404).json({
            //     success: false,
            //     message: "User not found"
            // });
            const err = new Error("User not found");
            err.statusCode = 404;

            return next(err);
        }

        user.totalExpense -= Number(expense.expenseAmount);

        await user.save({transaction});

        await transaction.commit();

        return res.status(200).json(expense);


    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        // res.status(500).send("Error while inserting ",error.message);

        const err = new Error('Error while inserting ',error.message);
        err.statusCode = 500;

        return next(err);
    }
}




const findCategory = async (req, res, next) => {

    const allowedCategories = [
        'Fuel',
        'Food',
        'Electricity',
        'Movie',
        'Bills',
        'Healthcare',
        'Education',
        'Other'
    ];

    try {
        const { description } = req.body;

        if (!description || !description.trim()) {
            // return res.status(400).json({
            //     message: 'Description is required'
            // });
            const err = new Error('Description is required');
            err.statusCode = 400;

            return next(err);
        }

        const category = await predictCategory(description);

        if (!allowedCategories.includes(category)) {
            return res.status(200).json({
                category: 'Other'
            });
        }

        res.status(200).json({ category });

    } catch (error) {
        // res.status(500).json({
        //     message: 'Unable to predict category'
        // });
        const err = new Error('Unable to predict category');
        err.statusCode = 500;

        return next(err);
    }
}




module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    findCategory
}