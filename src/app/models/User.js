const db = require('../config/db')
const crypto = require('crypto')

const Base = require("./Base")

Base.init({ table: "users" })

module.exports = {
    ...Base,
    all() {
        return db.query(`
        SELECT * FROM users
        ORDER BY updated_at DESC`)
    },
    async updateProfile(data) {
        try {
            const query = `
            UPDATE users SET
                name=($1),
                email=($2)
            WHERE id = $3
            `

            const values = [
                data.name,
                data.email,
                data.id
            ]

            return db.query(query, values)

        } catch (err) {
            console.error(err)
        }
    },
    async findByEmail(email) {
        const results = await db.query(`
        SELECT * FROM users
        WHERE email = $1`, [email])

        return results.rows[0]
    }
}
