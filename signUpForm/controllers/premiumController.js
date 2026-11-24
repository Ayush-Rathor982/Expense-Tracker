const { Sequelize } = require('sequelize');
const { Op, fn, col, literal } = require('sequelize');
const Expenses = require('../models/Expenses')
const Users = require('../models/Users')



//Optimized Solution

const getLeaderBoardData = async (req, res) => {
    try {

        const users = await Users.findAll({
            attributes: ['id','name','totalExpense'],
            order: [
                [Sequelize.literal('totalExpense'), 'DESC']
            ],
        })

        console.log(users)

        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.error("Error fetching expenses:", error);

        return res.status(500).json({
            success: false,
            message: "Error while fetching expenses",
            error: error.message
        });
    }
};




async function getExpenses(period,limit,offset,userId){

        let periodExpression;

        // Grouping based on date
        if (period === 'daily') {
            periodExpression = fn('DATE', col('createdAt'));
        }
        else if (period === 'weekly') {
            periodExpression = fn(
                'YEARWEEK',
                col('createdAt'),
                1
            );
        }
        else if (period === 'monthly') {
            // Group by year and month
            periodExpression = fn(
                'DATE_FORMAT',
                col('createdAt'),
                '%Y-%m'
            );
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid period. Use daily, weekly, or monthly.'
            });
        }

        const expenses = await Expenses.findAll({
            attributes: [
                [periodExpression, 'period'],
                'category',
                [fn('SUM', col('expenseAmount')), 'totalExpense']
            ],

            where: {
                UserId: userId
            },

            group: [
                periodExpression,
                'category'
            ],

            order: [
                [periodExpression, 'DESC'],
                ['totalExpense', 'DESC']
            ],

            limit,
            offset,
            raw: true
        });

    return expenses;
}


const getExpenseReport = async (req, res) => {
    try {
        const { userId, period } = req.params;

        const page = parseInt(req.query.page) || 0;

        const limit = 10;
        const offset = page === 0 ? 0 : (page - 1) * limit;

        let expenses = await getExpenses(
            period,
            page === 0 ? Number.MAX_SAFE_INTEGER : limit,
            offset,
            userId
        );     
        
        
        const totalExpenses = expenses.length

        if(totalExpenses > 10){
            expenses = expenses.slice(0, 10);
        }

        return res.status(200).json({
            success: true,
            expenses,
            totalExpense : totalExpenses
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch expense report'
        });
    }
};



// left join Operation
// const getLeaderBoardData = async (req, res) => {
//     try {

//         const users = await Users.findAll({
//             attributes: [
//                 'id',
//                 'name',
//                 [
//                     Sequelize.fn('SUM', Sequelize.col('Expenses.expenseAmount')),
//                     'totalExpense'
//                 ],
//             ],
//             include: [
//                 {
//                     model: Expenses,
//                     attributes: []
//                 }
//             ],
//             group: ['Users.id'],
//             order: [
//                 [Sequelize.literal('totalExpense'), 'DESC']
//             ],
//             raw: true
//         });

//         console.log(users)

//         return res.status(200).json({
//             success: true,
//             users
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
    getLeaderBoardData,
    getExpenseReport
}