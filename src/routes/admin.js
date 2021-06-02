const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/RecipesController')
const ChefsController = require('../app/controllers/ChefsController')
const UserController = require('../app/controllers/UserController')
const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/user')
const ProfileValidator = require('../app/validators/profile')
const { onlyUsers, isAdmin } = require('../app/middlewares/session')

// RECIPES

routes.get("/", RecipesController.index)
routes.get("/recipes", RecipesController.index)

routes.get("/recipes/create", RecipesController.create)
routes.get("/recipes/:id", RecipesController.show)
routes.get("/recipes/:id/edit", RecipesController.edit)

routes.post("/recipes", multer.array("photos", 5), RecipesController.post)
routes.put("/recipes", multer.array("photos", 5), RecipesController.put)
routes.delete("/recipes", RecipesController.delete)

// CHEFS

routes.get("/chefs", ChefsController.index)

routes.get("/chefs/create", isAdmin, ChefsController.create)
routes.get("/chefs/:id", ChefsController.show)
routes.get("/chefs/:id/edit", isAdmin, ChefsController.edit)

routes.post("/chefs", multer.single("photo"), ChefsController.post)
routes.put("/chefs", multer.single("photo"), ChefsController.put)
routes.delete("/chefs", ChefsController.delete)

// Rotas de perfil de um usuário logado
    
routes.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', onlyUsers, ProfileValidator.update, ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users',  UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/users', isAdmin, UserValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/users/create', isAdmin, UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/users', UserValidator.update, isAdmin, UserController.put) // Editar um usuário
routes.get('/users/:id/edit', isAdmin, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.get('/users/:id/delete', isAdmin, UserController.deleteDashBoard) // Deleta um usuario pelo dashboard
routes.delete('/users', isAdmin, UserController.delete) // Deletar um usuário

module.exports = routes
