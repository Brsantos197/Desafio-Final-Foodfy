const db = require('../config/db')
const { date } = require('../../lib/utils')

const Base = require("./Base")

Base.init({ table: "chefs" })

module.exports = {
    ...Base,
    create(data, file_id) {
        const query = `
        INSERT INTO chefs (
            file_id,
            name,
            created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
        `
        const values = [
            file_id,
            data.name,
            date(Date.now()).iso
        ]

        return db.query(query, values)

    },
    all() {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY updated_at DESC
        `)
    }, 
    find(id) {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
        ORDER BY chefs.id`, [id])
    },
    chefRecipes(id) {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id, recipes.id`, [id])
    },
    file(id) {
        return db.query(`
        SELECT * FROM files WHERE id = $1`, [id])
    }
}
