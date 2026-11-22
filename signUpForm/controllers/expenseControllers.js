const { Sequelize } = require('sequelize');
const Expenses = require('../models/Expenses')
const Users = require('../models/Users')
const predictCategory = require('../services/geminiService');

const getExpenses = async (req,res) => {
    try {
        
        const expenses = await Expenses.findAll({
            where : {
                UserId : req.user.id
            }
        });

        console.log("Get expense for user id ",req.user.id);
        console.log(" expense for user id ",expenses);

        if(expenses.length === 0){
             return res.status(404).send("expense not found");
        }

        return res.status(200).json(expenses);

    } catch (error) {
        res.status(500).send("Error while fetching ",error.message);
    }
}


const addExpense = async (req, res) => {
    console.log("received data:", req.body, " useId: ",req.user.id);

    try {
        const expense = await Expenses.create({
            ...req.body,
            UserId: req.user.id
        });

        if (!expense) {
            return res.status(400).json({
                success: false,
                message: "Expense not added"
            });
        }

        const user = await Users.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.totalExpense += Number(expense.expenseAmount);

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error while inserting expense",
            error: error.message
        });
    }
};

const deleteExpense = async (req,res) => {
    try {
        
        const {id} = req.params;

        

        const expense = await Expenses.findOne({
            where : {
                id : id,
            }
        });
        
        await Expenses.destroy({
            where : {
                id : id,
            }
        });

        console.log("deleted Expense: ", expense);

        if(!expense){
            return res.status(404).send("expense not added");
        }

        const user = await Users.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.totalExpense -= Number(expense.expenseAmount);

        await user.save();

        return res.status(200).json(expense);


    } catch (error) {
        res.status(500).send("Error while inserting ",error.message);
    }
}




const findCategory = async (req, res) => {

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
            return res.status(400).json({
                message: 'Description is required'
            });
        }

        const category = await predictCategory(description);

        if (!allowedCategories.includes(category)) {
            return res.status(200).json({
                category: 'Other'
            });
        }

        res.status(200).json({ category });

    } catch (error) {
        res.status(500).json({
            message: 'Unable to predict category'
        });
    }
}



// const getTotalExpensesByUsers = async (req, res) => {
//     try {

//         const expenses = await Expenses.findAll({
//             attributes: [
//                 'userId',
//                 [
//                     Sequelize.fn('SUM', Sequelize.col('expenseAmount')),
//                     'totalExpense'
//                 ],
//                 [
//                     Sequelize.col('User.name'),
//                     'name'
//                 ]
//             ],
//             include: [
//                 {
//                     model: Users,
//                     attributes: []
//                 }
//             ],
//             group: [
//                 'expenses.userId',
//                 'User.id',
//                 'User.name'
//             ],
//             order: [
//                 [Sequelize.literal('totalExpense'), 'DESC']
//             ],
//             raw: true
//         });

//         return res.status(200).json({
//             success: true,
//             expenses
//         });

//     } catch (error) {
//         console.error("Error fetching expenses:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Error while fetching expenses",
//             error: error.message
//         });
//     }
// };


module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    findCategory
    // getTotalExpensesByUsers
}