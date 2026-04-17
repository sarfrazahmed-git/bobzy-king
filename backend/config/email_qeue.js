const {Queue} = require('bullmq');
const redisClient = require("./redis")

const emailQueue = new Queue("Email-Tasks",{
    connection: redisClient,})


async function verifyEmailJob(email,token){
    await emailQueue.add("verifyEmail",
        {email,token},
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000
            }
        }
    )
}

module.exports = {
    verifyEmailJob
}