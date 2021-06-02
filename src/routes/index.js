const express = require('express')
const routes = express.Router()
const HomeController = require('../app/controllers/HomeController')

const admin = require('./admin')
const home = require('./home')
const user = require('./user')

routes.get("/", HomeController.index)

routes.use("/home", home)
routes.use("/admin", admin)
routes.use("/user", user)

module.exports = routes