const {z1} = require("zod");

const signupSchema = z1.object({
    username: z1.string().min(3, "Username must be at least 3 characters long"),
    email: z1.string().email("Invalid email format"),
    password: z1.string().min(6, "Password must be at least 6 characters long").max(30, "Password must be less than 30 characters long"),
    }).strict();

const loginSchema = z1.object({
    email: z1.string().email("Invalid email format"),
    password: z1.string().min(6, "Password must be at least 6 characters long").max(30, "Password must be less than 30 characters long"),
}).strict();

module.exports = {
    signupSchema,
    loginSchema
}