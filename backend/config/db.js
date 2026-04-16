const pg = require("pg")
require("dotenv").config()

const pool = new pg.Pool({
    connectionString: process.env.DB_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

function query(text, params){
    return pool.query(text, params)
}

async function getClient(){
    return await pool.connect()
}

module.exports = {
    query,
    getClient
}