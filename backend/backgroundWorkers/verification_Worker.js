const {Worker} = require("bullmq")
const {sendVerificationEmail} = require("../utils/email_service")
const redisClient = require("../config/redis")
const { email } = require("zod")


const emailWorker = new Worker("verifyEmail", async (job) => {
    const {email, token} = job.data
    try{
        await sendVerificationEmail(email, token)
    } catch (error) {
        // console.error("Error in verification worker:", error)
        throw error
    }
},{connection: redisClient, concurrency: 5})

emailWorker.on("completed", (job) => {
    console.log(`Email verification job completed for: ${job.data.email}`)
})

emailWorker.on("failed", (job, err) => {
    console.error(`Email verification job failed for: ${job.data.email}, Error: ${err.message}`)
})
