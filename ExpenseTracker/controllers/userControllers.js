require('dotenv').config();
const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const mySecretKey = process.env.mySecretKey


const addUser = async (req,res,next) => {

    try {

        const {name, email, password} = req.body;

        const saltRounds = 10

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await Users.create({
            name,
            email,
            password : hashedPassword
        });


        if(!user){
            // return res.status(400).json({
            //     success: false,
            //     message: "User not created"
            // });
            const err = new Error('User not created');
            err.statusCode = 400;

            return next(err);
        }


        return res.status(201).json(user);

    } catch (error) {
        // res.status(500).send("Error while SignUp ",error.message);
        const err = new Error("Error while SignUp ",error.message);
        err.statusCode = 500;

        return next(err);
    }
}

function generateAccessToken(id){
    return jwt.sign({userId:id}, mySecretKey);
}


const checkUser = async (req,res,next) => {

    try {

        const {email, password} = req.body;

        const user = await Users.findOne({
            where : {
                email : email
            }
        });

        if(!user){
            // return res.status(404).send("User not found with email");
            const err = new Error("User not found with email");
            err.statusCode = 404;

            return next(err);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            // return res.status(401).send("Wrong Password");
            const err = new Error("Wrong Password");
            err.statusCode = 401;

            return next(err);
        }

        
        const token = generateAccessToken(user.id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });


        return res.status(200).json({
            success : true,
            message : "User Loged In Successfully",
            isPremium : user.isPremium,
            token : token
        });

    } catch (error) {
        // res.status(500).send("Error while LogIn ",error.message);
        const err = new Error("Error while LogIn ",error.message);
        err.statusCode = 401;

        return next(err);
    }
}



module.exports = {
    addUser,
    checkUser,
}