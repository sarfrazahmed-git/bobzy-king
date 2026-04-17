const nodemailer = require("nodemailer")
const { email } = require("zod")


const transporter = nodemailer.createTransport.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: "bobzythekink@gmail.com",
        pass: 'znzj gxyt hsua flna'
    }
})


const sendVerificationEmail = async (email, token) => {
    const mailOptions = {
        from: "bobzythekink@gmail.com",
        to: email,
        subject: "Email Verification",
        text: `Please verify your email by clicking the following link: http://localhost:3000/verify?token=${token}`  
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