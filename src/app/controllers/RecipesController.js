const { unlinkSync } = require('fs')

const Recipe = require('../models/Recipe')
const RecipeFiles = require('../models/File_recipe')
const File = require('../models/File')
const User = require('../models/User')


module.exports = {
    async index(req, res) {
        try {
            let results = await Recipe.all()
            
            async function getImage(recipeId) {
                results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace(/\\/g, "/")}`)
                return files[0]
            }

            const recipePromise = results.rows.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            })

            const recipes = await Promise.all(recipePromise)

            return res.render("admin/recipes/index", { recipes } )
        }
        catch(err) {
            console.error(err)
        }
    },
    
    async create(req, res)  {    

        try {
            const results = await Recipe.chefSelectOptions()
        
            return res.render("admin/recipes/create", { chefOptions: results.rows })
            
        } catch (err) {
            console.error(err)
        }
        
    },
    
    async post(req, res) {
        
        try {
            if (req.files.length == 0) return res.render('admin/recipes/create', {
                recipe: req.body,
                alert: 'Por favor selecione pelo menos uma imagem!'
            })
            
            let results = await Recipe.create(req.body, req.session.userId)
            const recipeId = results.rows[0].id
            
            const filesPromise = req.files.map(file => File.create({ name: file.filename, path: file.path }))
            const filesIds = await Promise.all(filesPromise)

            const recipePromise = filesIds.map(fileId => RecipeFiles.create({ recipe_id: recipeId, file_id: fileId}))
            await Promise.all(recipePromise)

            results = await Recipe.find(recipeId)
            const recipe = results.rows[0]

            results = await Recipe.files(recipe.id)
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render(`admin/recipes/show`,{
                recipe,
                files,
                success: 'Receita criada com sucesso'
            })
                
        } catch (err) {
            console.error(err)
            let results = await Recipe.all()
            
            async function getImage(recipeId) {
                results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace(/\\/g, "/")}`)
                return files[0]
            }

            const recipePromise = results.rows.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            })

            const recipes = await Promise.all(recipePromise)

            return res.render("admin/recipes/index", {
                recipes,
                error: 'Erro inesperado tente novamente mais tarde!'
            } )
        }
    },
    
    async show(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
    
            if(!recipe) {
                let results = await Recipe.all()
            
            async function getImage(recipeId) {
                results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace(/\\/g, "/")}`)
                return files[0]
            }

            const recipePromise = results.rows.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            })

            const recipes = await Promise.all(recipePromise)
                return res.render("admin/recipes/index",{
                    recipes,
                    error: 'Receita não cadastrada'
                })
            }
    
            results = await Recipe.files(recipe.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
    
            return res.render("admin/recipes/show", { recipe, files })
        } catch (err) {
            console.error(err)
        }
    },
    
    async edit(req, res)  {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
            
            if(!recipe) {
                let results = await Recipe.all()
            
            async function getImage(recipeId) {
                results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace(/\\/g, "/")}`)
                return files[0]
            }

            const recipePromise = results.rows.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            })

            const recipes = await Promise.all(recipePromise)
                return res.render("admin/recipes/index",{
                    recipes,
                    error: 'Receita não cadastrada'
                })
            }
            
            results = await Recipe.chefSelectOptions()
            options = results.rows
    
            results = await Recipe.files(recipe.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            const user =  await User.find(req.session.userId)
            
            if (recipe.user_id == user.id || user.is_admin == true) {
                return res.render("admin/recipes/edit", { chefOptions: options, recipe, files  })
            } else {
                return res.render("admin/recipes/show", {
                    recipe,
                    files,
                    alert: 'Você não tem permissão para alterar esta receita'
                })
            }
            
        } catch (err) {
            console.error(err)
        }

    },
    
    async put(req, res) {

        try {

            let { chef, title, ingredients, preparation, information } = req.body

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file => File.create({ name: file.filename, path: file.path}))
                const filesIds = await Promise.all(newFilesPromise)

                const recipePromise = filesIds.map(fileId => RecipeFiles.create({ recipe_id: req.body.id, file_id: fileId}))
                await Promise.all(recipePromise)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(async (id) => {
                    try {
                        const file = await File.findOne({ where: { id }})
                        File.delete(id);
                        unlinkSync(file.path)
                    } catch (error) {
                        console.error(error)
                    }
                })

                await Promise.all(removedFilesPromise)
            }

            await Recipe.update(req.body)

            results = await Recipe.find(req.body.id)
            const recipe = results.rows[0]

            results = await Recipe.files(recipe.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            result = await Recipe.chefSelectOptions()

            return res.render(`admin/recipes/edit`,{
                recipe,
                files,
                chefOptions: result.rows,
                success: 'Receita alterada com sucesso!'
            })
        } catch (err) {
            console.error(err)
            results = await Recipe.find(req.body.id)
            const recipe = results.rows[0]

            results = await Recipe.files(recipe.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            let result = await Recipe.chefSelectOptions()

            return res.render(`admin/recipes/edit`,{
                recipe,
                files,
                chefOptions: result.rows,
                error: 'Erro inesperado tente novamente mais tarde!'
            })
        }
    },
    
    async delete(req, res) {
        try {
            let results = await Recipe.files(req.body.id)
            const files = []

            files.push(results.rows[0])

            await Recipe.delete(req.body.id)

            results = await Recipe.all()

            files.map(file => {
                try {
                    File.delete(file.id);
                    unlinkSync(file.path);
                } catch (error) {
                    console.error(error);
                }
            })

            async function getImage(recipeId) {
                results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace(/\\/g, "/")}`)
                return files[0]
            }

            const recipePromise = results.rows.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            })

            const recipes = await Promise.all(recipePromise)

            return res.render("admin/recipes/index", {
                recipes,
                success: 'Receita deletada com sucesso!'
            })

            
        } catch (err) {
            console.error(err)
            let results = await Recipe.all()
            
            async function getImage(recipeId) {
                results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace(/\\/g, "/")}`)
                return files[0]
            }

            const recipePromise = results.rows.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            })

            const recipes = await Promise.all(recipePromise)

            return res.render("admin/recipes/index", {
                recipes,
                error: 'Erro inesperado tente novamente mais tarde!'
            } )
        }
    }
}



