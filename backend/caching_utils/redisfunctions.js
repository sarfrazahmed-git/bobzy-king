const redisClient = require("../config/redis");

async function setCache(key, value, ttl = 3600){
    try{
        await redisClient.set(key, value, 'EX', ttl);
    } catch (error) {
        console.error("Error setting cache:", error);
        throw error;
    }
}

async function setVerificationCode(key,value){
    const nkey = "verification_code:" + key
    const ttl = 86400
    await setCache(nkey, value, ttl)

}

async function setrefreshToken(key,value){
    const nkey = "refresh_token:" + key
    const ttl = process.env.REFRESH_TOKEN_EXPIRY || 7*24*60*60
    await setCache(nkey, value, ttl)   
}

async function getCache(key){
    try{
        const value = await redisClient.get(key);
        return value;
    } catch (error) {
        console.error("Error getting cache:", error);
        throw error;
    }
}

async function getverificationCode(key){
    const nkey = "verification_code:" + key
    return await getCache(nkey)
}

async function getrefreshToken(key){
    const nkey = "refresh_token:" + key
    return await getCache(nkey)
}

async function deleteCache(key){
    try{
        await redisClient.unlink(key);
    } catch (error) {
        console.error("Error deleting cache:", error);
        throw error;
    }
}

async function deleteVerificationCode(key){
    const nkey = "verification_code:" + key
    await deleteCache(nkey)
}

async function deleteRefreshToken(key){
    const nkey = "refresh_token:" + key
    await deleteCache(nkey)
}

module.exports = {
    setVerificationCode,
    getverificationCode,
    deleteVerificationCode,
    setrefreshToken,
    getrefreshToken,
    deleteRefreshToken
}