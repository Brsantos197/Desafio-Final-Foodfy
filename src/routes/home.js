const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

routes.get("/recipes", HomeController.list)
routes.get("/chefs", HomeController.chefs)
routes.get("/chefs/:id", HomeController.chefShow)
routes.get("/recipes/:id", HomeController.show)
routes.get("/sobre", function(req, res) {
    return res.render("site/sobre")
})

module.exports = routes