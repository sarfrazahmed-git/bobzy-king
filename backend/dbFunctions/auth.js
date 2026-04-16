const {getClient, query} = require("../config/db")

async function dbsignup(username, email, password,role){

    try{
        const client = await getClient()
        await client.query("BEGIN")
        var result = await client.query("SELECT COUNT(email) FROM users WHERE email = $1",[email])
        if(result.rows[0].count > 0){
            const emailExistsError = new Error("Email already exists")
            emailExistsError.statusCode = 400
            throw emailExistsError
        }
        
        result = await client.query("INSERT INTO users (username, email, password,role_id) VALUES ($1, $2, $3,$4) RETURNING id",[username, email, password,role])
        const user_id = result.rows[0].id
        await client.query("COMMIT")
        return user_id

    }
    catch(err){
        console.log(err)
        await client.query("ROLLBACK")
        throw err

    }
    finally{
        client.release()
    }

}

async function dblogin(email,password){
    try{
        const result = await query("SELECT id,password,role_id FROM users WHERE email = $1 and verified = true",[email])
        if (result.rows.length === 0){
            const userNotFoundError = new Error("User not found")
            userNotFoundError.statusCode = 400
            throw userNotFoundError
        }
        return result.rows[0]
    }
    catch(err){
        console.log(err)
        throw err
    }
}

module.exports = {
    dbsignup,
    dblogin
}

