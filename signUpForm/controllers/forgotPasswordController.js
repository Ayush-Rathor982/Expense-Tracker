
const Users = require('../models/Users');
const ForgotPasswordRequests = require('../models/forgotPasswordRequest');
const path = require('path');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../utils/db-connection');



const forgotPassword = async (req, res) => {
    const { v4: uuidv4 } = await import('uuid');

    try {
        const { email } = req.body;

        const user = await Users.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If the account exists, a reset link will be sent.'
            });
        }

        // Generate UUID
        const id = uuidv4();

        // Create forgot password request
        await ForgotPasswordRequests.create({
            id: id,
            isActive: true,
            UserId: user.id,
        });

        // Generate reset URL
        const resetUrl =
            `http://localhost:3000/password/resetpassword/${id}`;

        // Send email
        try {
            await sendResetEmail(email, resetUrl);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
            console.log(resetUrl);
        }

        return res.status(200).json({
            success: true,
            message: 'Password reset request created.',
            resetUrl: resetUrl // Development only
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Error creating password reset request'
        });
    }
};


async function sendResetEmail(email, resetUrl) {
    const client = Sib.ApiClient.instance;

    client.authentications['api-key'].apiKey =
        process.env.BREVO_API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    return await tranEmailApi.sendTransacEmail({
        sender: {
            email: 'arathor3516@gmail.com',
            name: 'Expense Tracker'
        },

        to: [{ email : 'arathor3516@gmail.com' }],

        subject: 'Reset Your Password',

        textContent: `Click this link to reset your password: ${resetUrl}`
    });
}




const getResetPasswordPage = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("id: ",id);

        const request = await ForgotPasswordRequests.findOne({
            where: {
                id: id,
                isActive: true
            }
        });

        console.log("request......: ", request)

        if (!request) {
            return res.status(400).send(
                'Invalid or already used password reset link'
            );
        }

        return res.sendFile(
            path.join(__dirname,"..","views","resetPassword.html")
        );

    } catch (error) {
        console.error(error);

        return res.status(500).send(
            'Error while opening reset password page'
        );
    }
};





const updatePassword = async (req, res) => {
    let transaction;

    try {
        const { id } = req.params;
        const { password } = req.body;

        // if (!password || password.length < 8) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Password must contain at least 8 characters'
        //     });
        // }

        transaction = await sequelize.transaction();

        // Find active reset request
        const request = await ForgotPasswordRequests.findOne({
            where: {
                id: id,
                isActive: true
            },
            transaction
        });

        if (!request) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset link'
            });
        }

        // Find associated user
        const user = await Users.findByPk(request.UserId, {
            transaction
        });

        if (!user) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        user.password = hashedPassword;

        await user.save({ transaction });

        // Disable reset link
        request.isActive = false;

        await request.save({ transaction });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Error updating password'
        });
    }
};





module.exports = {
    forgotPassword,
    getResetPasswordPage,
    updatePassword
}
