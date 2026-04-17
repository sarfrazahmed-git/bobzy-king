const nodemailer = require("nodemailer")
const { email } = require("zod")
require("dotenv").config()

const transporter = nodemailer.createTransport.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: process.env.Email,
        pass: process.env.pass
    }
})


const sendVerificationEmail = async (email, token) => {
    const mailOptions = {
        from: process.env.Email,
        to: email,
        subject: "Email Verification",
        text: `${process.env.verificationLink}${token}`
    }

    try{
        await transporter.sendMail(mailOptions)
        console.log("Verification email sent to: ", email)
    }
    catch(err){
        console.log("Error in sendVerificationEmail: ", err)
        throw err
    }
}

module.exports = {
    sendVerificationEmail
}