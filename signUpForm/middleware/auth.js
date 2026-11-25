require('dotenv').config();
const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const mySecretKey = process.env.JWT_Key


const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token missing'
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, mySecretKey);

        // Find user in database
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid User'
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};


const isPremium = async (req, res, next) => {
    try {
        // Get JWT from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send('Please login first');
        }

        // Verify JWT
        const decoded = jwt.verify(token, mySecretKey);

        // Find user
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).send('Invalid user');
        }

        // Check premium status
        if (!user.isPremium) {
            return res.status(403).send('You are not a premium user');
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {

        return res.status(401).send('Authentication failed');
    }
};



module.exports = {
    authenticate,
    isPremium
}