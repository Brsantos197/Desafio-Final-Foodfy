const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        const { filter } = req.query 
        
        if (filter) {
            try {
                let results = await Recipe.findBy(filter)

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
    
    
                return res.render("site/index", { recipes, filter })
            } catch (err) {
              console.error(err)  
            }
        } else {
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

                return res.render("site/index", { recipes })
            } catch (err) {
              console.error(err)  
            }
        }
    },
    async list(req, res) {
        const { filter } = req.query
        
        if (filter) {
            try {
                let results = await Recipe.findBy(filter)

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
                return res.render("site/recipes", { recipes, filter })
            } catch (err) {
              console.error(err)  
            }
        } else {
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

                return res.render("site/recipes", { recipes })
            } catch (err) {
              console.error(err)  
            }
        }
    },
    async show(req, res) {
        try {
            let results = await Recipe.find(req.params.id )
            const recipe = results.rows[0]

            if(!recipe) return res.send("Recipe not found!")

            results = await Recipe.files(recipe.id)
        
            const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`,
            }))
        
            return res.render("site/show", { recipe, files })

        } catch (err) {
            console.error(err)
        }
    
    },
    async chefs(req, res) {
        try {
            let results = await Chef.all()

            async function getImage(fileId) {
                results = await Chef.file(fileId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "").replace("assets", "images").replace(/\\/g, "/")}`)
                return files[0]
            }

            const chefPromise = results.rows.map(async chef => {
                chef.img = await getImage(chef.file_id)
                return chef
            })

            const chefs = await Promise.all(chefPromise)

            return res.render("site/chefs", { chefs })

            } catch (err) {
                console.error(err)
        }
    },
    async chefShow(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if(!chef) return res.send("Chef not found!")


            results = await Chef.file(chef.file_id)

            const fileResult = results.rows[0]

            const file = {
                ...fileResult,
                src: `${req.protocol}://${req.headers.host}${fileResult.path.replace("public", "").replace("assets", "images")}`
            }

            results = await Chef.chefRecipes(chef.id)

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

            return res.render("site/chef", { chef, recipes, file })
        } catch (err) {
            console.error(err)
        }
    }
}



