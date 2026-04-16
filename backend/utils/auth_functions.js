const bcrypt = require("bcrypt")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
require("dotenv").config();

async function hashPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function comparePassword(password, hashedPassword){
    return await bcrypt.compare(password, hashedPassword);
}

function generateAccessToken(user, expiry){
    const payload = {
        id : user.id,
        role: user.role
    }
    const secret = process.env.JWT_SECRET
    const token = jwt.sign(payload, secret, {expiresIn: expiry})
}

function generateRefreshToken(){
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const refreshHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    return {refreshToken, refreshHash}
}

module.exports = {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken
}