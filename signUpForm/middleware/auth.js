const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const mySecretKey = '180ab620f1708bb009f3e820bd5c9a6006bd30307fdba42b3050b602903860cf14301e392fe6849ee99ed5ac27ebca96bc9ab6d7eb8544df6c6ea9942a6932e3';


const authenticate = (req,res,next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);

        const user = jwt.verify(token, mySecretKey);

        console.log("user from token: ", user)

        User.findByPk(user.userId).then(user => {
            req.user = user;
            next();
        });

    } catch (error) {
        console.log(error);
        return res.status(401).json({success:false});
    }
}

module.exports = {
    authenticate
}