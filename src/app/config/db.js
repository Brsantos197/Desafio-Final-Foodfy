const { Pool } = require('pg')

module.exports = new Pool({
    user: '', // Seu Usuário no PostGresSQL
    password: '', // Sua Senha no PostGresSQL
    host: 'localhost',
    port: 5432,
    database: 'foodfy'
})