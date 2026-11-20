const Users = require('../models/Users')
const bcrypt = require('bcrypt')

// const getExpenses = async (req,res) => {
//     try {
        
//         const expenses = await Expenses.findAll();

//         if(expenses.length === 0){
//              return res.status(404).send("expense not found");
//         }

//         return res.status(200).json(expenses);

//     } catch (error) {
//         res.status(500).send("Error while fetching ",error.message);
//     }
// }

const addUser = async (req,res) => {
    console.log("received signup data: ",req.body)

    try {

        const {name, email, password} = req.body;

        const saltRounds = 10

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await Users.create({
            name,
            email,
            password : hashedPassword
        });

        return res.status(201).json(user);

    } catch (error) {
        res.status(500).send("Error while SignUp ",error.message);
    }
}


const checkUser = async (req,res) => {
    console.log("received login data: ",req.body)

    try {

        const {email, password} = req.body;

        const user = await Users.findOne({
            where : {
                email : email
            }
        });

        if(!user){
            return res.status(404).send("User not found with email");
        }

        console.log(user)

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).send("Wrong Password");
        }

        return res.status(200).json(user);

    } catch (error) {
        res.status(500).send("Error while LogIn ",error.message);
    }
}



// const deleteExpense = async (req,res) => {
//     try {
        
//         const {id} = req.params;

//         const expense = await Expenses.destroy({
//             where : {
//                 id : id
//             }
//         });

//         if(!expense){
//             return res.status(404).send("expense not added");
//         }

//         return res.status(200).json(expense);


//     } catch (error) {
//         res.status(500).send("Error while inserting ",error.message);
//     }
// }

module.exports = {
    addUser,
    checkUser,
    // getExpenses,
    // deleteExpense
}