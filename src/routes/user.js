const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const { isLoggedRedirectToProfile } = require('../app/middlewares/session')
const SessionValidator = require('../app/validators/session')

// // // login/logout
routes.get('/login', isLoggedRedirectToProfile, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// // // reset password / forgot

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/reset-password', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/reset-password', SessionValidator.reset, SessionController.reset)

module.exports = routes