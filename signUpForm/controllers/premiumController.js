const { Sequelize } = require('sequelize');
const Expenses = require('../models/Expenses')
const Users = require('../models/Users')



const getLeaderBoardData = async (req, res) => {
    try {

        const users = await Users.findAll({
            attributes: [
                'id',
                'name',
                [
                    Sequelize.fn('SUM', Sequelize.col('Expenses.expenseAmount')),
                    'totalExpense'
                ],
            ],
            include: [
                {
                    model: Expenses,
                    attributes: []
                }
            ],
            group: ['Users.id'],
            order: [
                [Sequelize.literal('totalExpense'), 'DESC']
            ],
            raw: true
        });

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


module.exports = {
    getLeaderBoardData
}