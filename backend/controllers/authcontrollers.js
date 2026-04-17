const {hashPassword, comparePassword, generateAccessToken, generateRefreshToken} = require("../utils/auth_functions")
const {dbsignup, dblogin,dbVerifyEmail} = require("../dbFunctions/auth")
const {verifyEmailJob} = require("../caching_utils/emailQeueu")
const {setVerificationCode,setrefreshToken,deleteVerificationCode,getverificationCode} = require("../caching_utils/redisfunctions")


require("dotenv").config();

async function signup(req,res){
    const {username, email, password,role} = req.body
    try{
        const hashedPassword = await hashPassword(password)
        const user_id = await dbsignup(username, email, hashedPassword,role)
        const {refreshToken, refreshHash} = generateRefreshToken()
        await setVerificationCode(refreshHash,user_id)
        await verifyEmailJob(email, refreshToken)
        res.status(201).json({message: "pls verify your email to login"})
    }
    catch(err){
        if (err.statusCode){
            res.status(err.statusCode).json({error: err.message})
        }
        else{
            res.status(500).json({error: "Internal Server Error"})
        }
    }
}

async function login(req,res){
    const {email, password} = req.body
    try{
        const user = await dblogin(email,password)
        const passwordMatch = await comparePassword(password, user.password)
        if (!passwordMatch){
            res.status(400).json({error: "Invalid credentials"})
            return
        }
        const accessToken = generateAccessToken({id: user.id, role: user.role_id}, "15m")
        const {refreshToken, refreshHash} = generateRefreshToken()
        const refreshTime = process.env.REFRESH_TOKEN_EXPIRY || 7*24*60*60
        
        await setrefreshToken(refreshHash, user.id)
        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true, sameSite: "strict", path:"/refresh", maxAge: refreshTime*1000})
        res.cookie("accessToken", accessToken, {httpOnly: true, secure: true, sameSite: "strict", maxAge: 15*60*1000})
        res.status(200).json({message: "Login successful"})
    
    }
    catch(err){
        if (err.statusCode){
            res.status(err.statusCode).json({error: err.message})
        }
        else{
        res.status(500).json({error: "Internal Server Error"})
    }}
}

async function verifyEmail(req,res){
        const {token} = req.query.token
        if (!token){
            res.status(400).json({error: "Token is required"})
            return
        }
        
        try{
            const user_id = await getverificationCode(token)
            if (!user_id){
                res.status(400).json({error: "Invalid or expired token"})
                return
            }
            await dbVerifyEmail(user_id)
            await deleteVerificationCode(token)
            res.status(200).json({message: "Email verified successfully"})
        }
        catch(err){
            if (err.statusCode){
                res.status(err.statusCode).json({error: err.message})
            }
            else{
                res.status(500).json({error: "Internal Server Error"})
            }
        }
}



module.exports = {
    signup,
    login,
    verifyEmail
}

