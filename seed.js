const faker = require('faker')
const { hash } = require('bcryptjs')

const Chef = require('./src/app/models/Chef')
const User = require('./src/app/models/User')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')
const File_recipe = require('./src/app/models/File_recipe')

const data = require('./data.json')

const totalChefs = 6
const totalUsers = 6
const totalRecipes = 6


function getRandomValue(params) {
    const result = Math.floor(Math.random() * params.length)
    return params[result]
}

async function createData() {
    try {
        // Criando avatar para chefs
        let files = []
        let totalFiles = 2
        
        let chefsIds = []
        let recipesIds = []

        const avatarImages = ['avatar_chef', 'avatar_chef2']

        while (files.length < totalFiles) {
            files.push({
                name: faker.image.image(),
                path: `public/assets/${getRandomValue(avatarImages)}.png`,
            })
        }

        let filesPromise = files.map(file => File.create(file))

        let filesIds = await Promise.all(filesPromise)
        
        // Criando Chefs
        const chefs = []
        let id = -1
        while (chefs.length < totalChefs) {
            id++
            chefs.push({
                name: data.recipes[id].author,
                file_id: filesIds[Math.floor(Math.random() * totalFiles)]
            })
            
        }

        const chefsPromise = chefs.map(chef => Chef.create(chef, chef.file_id))

        let results = await Promise.all(chefsPromise)


        for(result of results) {
            chefsIds.push(result.rows[0].id)
        }

        // Criando usuarios

        let users = []
        let password =  '1111' //await hash('1111', 8)
        isAdmin = [true, false]
        id = -1

        while (users.length < totalUsers) {
            id++
            users.push({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password,
                is_admin: getRandomValue(isAdmin),
            })
        }

        const usersPromise = users.map(user => User.create(user, user.password))

        let usersIds = await Promise.all(usersPromise)


        // Criando imagens das receitas
        files = []
        id = -1
        
        while (files.length < totalRecipes) {
            id++
            files.push({
                name: data.recipes[id].fileName,
                path: `public/assets/${data.recipes[id].fileName}.png`
            })
        }

        filesPromise = files.map(file => File.create(file))
        
        filesIds = await Promise.all(filesPromise)

        // Criando receitas
        let recipes = []
        id = -1

        while (recipes.length < totalRecipes) {
            id++
            recipes.push({
                ingredients: data.recipes[id].ingredients,
                preparation: data.recipes[id].preparation,
                information: data.recipes[id].information,
                title: data.recipes[id].title,
                chef_id: chefsIds[id],
                user_id: usersIds[id]
            })
        }

        const recipesPromise = recipes.map(recipe => Recipe.create(recipe, recipe.user_id))

        results = await Promise.all(recipesPromise)
        
        for(result of results) {
            recipesIds.push(result.rows[0].id)
        }

        // Referenciando imagens das receitas
        let fileRecipes = []
        id = -1

        while (fileRecipes.length < totalRecipes) {
            id++
            fileRecipes.push({
                recipe_id: recipesIds[id],
                file_id: filesIds[id]
            })
        }
        const fileRecipesPromises = fileRecipes.map(file => File_recipe.create({ recipe_id: file.recipe_id, file_id: file.file_id}))

        await Promise.all(fileRecipesPromises)

    }
   catch (err) {
       console.error(err)
    } 
}

createData()
