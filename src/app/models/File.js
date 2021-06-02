const db = require('../config/db')

const Base = require("./Base")

Base.init({ table: "files" })

module.exports = {
    ...Base,
    find(id) {
        return db.query(`
        SELECT files. *
        FROM files
        LEFT JOIN chefs ON (files.id = chefs.file_id)
        WHERE chefs.id = $1`, [id])
    },
    
}
