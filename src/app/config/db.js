const { Pool } = require('pg')

module.exports = new Pool({
    user: 'postgres',
    password: 'br911979333',
    host: 'localhost',
    port: 5432,
    database: 'foodfy'
})