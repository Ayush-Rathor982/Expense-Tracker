const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const Users = require('../models/Users');

const getPassword = async(req,res) => {

    try {
        const { email } = req.body;

        const user = await Users.findOne({
            where : {
                email : email
            }
        });

        if(!user){
            return res.status(404).send("User not found with email");
        }


        await sendPassword(email,user.password);

        return res.status(200).json({
            success : true,
            message : "Password Send Successfully",
        });

    } catch (error) {
        res.status(500).send("Error while getting password ",error.message);
    }

}


async function sendPassword(email,password) {
    const client = Sib.ApiClient.instance

    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY

    const tranEmailApi = new Sib.TransactionalEmailsApi()

    const sender = {
        email : 'arathor3516@gmail.com'
    }

    const receiver = [
        {
            email : 'arathor3516@gmail.com'
        }
    ]

    tranEmailApi.sendTransacEmail({
        sender,
        to : receiver,
        subject: 'password for your email',
        textContent: password
    })
    .then(res => 
        console.log(res)
    )
    .catch(err => 
        console.log(err)
    )
}




module.exports = {
    getPassword
}