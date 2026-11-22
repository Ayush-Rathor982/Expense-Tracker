const { Sequelize } = require('sequelize');
const Expenses = require('../models/Expenses')
const Users = require('../models/Users')

const getExpenses = async (req,res) => {
    try {
        
        const expenses = await Expenses.findAll({
            where : {
                userId : req.user.id
            }
        });

        if(expenses.length === 0){
             return res.status(404).send("expense not found");
        }

        return res.status(200).json(expenses);

    } catch (error) {
        res.status(500).send("Error while fetching ",error.message);
    }
}


const addExpense = async (req, res) => {
    console.log("received data:", req.body);

    try {
        const expense = await Expenses.create({
            ...req.body,
            userId: req.user.id
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

        const expense = await Expenses.destroy({
            where : {
                id : id,
                userId : req.user.id
            }
        });

        if(!expense){
            return res.status(404).send("expense not added");
        }

        return res.status(200).json(expense);


    } catch (error) {
        res.status(500).send("Error while inserting ",error.message);
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
    // getTotalExpensesByUsers
}