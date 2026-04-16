const {hashPassword, comparePassword, generateAccessToken, generateRefreshToken} = require("../utils/auth_functions")
const {dbsignup, dblogin} = require("../dbFunctions/auth")
require("dotenv").config();

async function signup(req,res){
    const {username, email, password,role} = req.body
    try{
        const hashedPassword = await hashPassword(password)
        const user_id = await dbsignup(username, email, hashedPassword,role)
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
        
        
        // put refreshHash in redis with expiry


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


module.exports = {
    signup,
    login
}

