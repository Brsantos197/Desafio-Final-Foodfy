const db = require('../config/db')
const { date } = require('../../lib/utils')

const Base = require("./Base")

Base.init({ table: "recipes" })

module.exports = {
    ...Base,
    all() {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY updated_at DESC`)
    },
    create(data, userId) {
        const query = `
        INSERT INTO recipes (
            title,
            chef_id,
            ingredients,
            preparation,
            information,
            created_at,
            user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
        `
        const values = [
            data.title,
            data.chef_id,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso,
            userId
        ]

        return db.query(query, values)

    },

    find(id) {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        ORDER BY recipes.id`, [id])
    },
    findBy(filter) {
        return db.query(`
        SELECT recipes. *, count(recipes) AS total_recipes, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        OR chefs.name ILIKE '%${filter}%'
        GROUP BY recipes.id, chefs.name
        ORDER BY recipes.updated_at DESC`)
    },
    chefSelectOptions() {
        return db.query(`SELECT name, id FROM chefs`)
    },
    update(data) {
        const query = `
        UPDATE recipes SET
            title=($1),
            chef_id=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
        WHERE id = $6
        `

        const values = [
            data.title,
            data.chef_id,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)
    },
    files(id) {
        return db.query(`
        SELECT files.*, recipe_files.recipe_id AS recipe_id
        FROM files
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1`, [id])
    }
}
