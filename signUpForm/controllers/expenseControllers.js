const Expenses = require('../models/Expenses')

const getExpenses = async (req,res) => {
    try {
        
        const expenses = await Expenses.findAll();

        if(expenses.length === 0){
             return res.status(404).send("expense not found");
        }

        return res.status(200).json(expenses);

    } catch (error) {
        res.status(500).send("Error while fetching ",error.message);
    }
}

const addExpense = async (req,res) => {
    console.log("received data: ",req.body)

    try {
        const expense = await Expenses.create({
            ...req.body
        });

        if(!expense){
            return res.status(404).send("expense not added");
        }

        return res.status(200).json(expense);

    } catch (error) {
        res.status(500).send("Error while inserting ",error.message);
    }
}

const deleteExpense = async (req,res) => {
    try {
        
        const {id} = req.params;

        const expense = await Expenses.destroy({
            where : {
                id : id
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

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense
}