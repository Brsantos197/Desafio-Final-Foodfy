const { file } = require('../models/Chef')
const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            let results = await Chef.all()

            async function getImage(fileId) {
                results = await Chef.file(fileId)
                let files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path}`.replace("public", "").replace(/\\/g, "/").replace("assets","images"))
                return files[0]
            }

            const chefPromise = results.rows.map(async chef => {
                chef.img = await getImage(chef.file_id)
                return chef
            })

            const chefs = await Promise.all(chefPromise)

            return res.render("admin/chefs/index", { chefs, file })
        } catch (err) {
            console.error(err)
        }
    },
    
    create(req, res)  {    
        return res.render("admin/chefs/create")
    },
    
    async post(req, res) {
        try {

            if (!req.file) return res.render('admin/chefs/create', {
                chef: req.body,
                alert: 'Por favor selecione pelo menos uma imagem!'
            })

            const fileData = {
                name: req.file.filename,
                path: req.file.path
            }

            let file = await File.create(fileData)

            let newChef = await Chef.create(req.body, file)
            
            let results = await Chef.find(newChef.rows[0].id)
            const chef = results.rows[0]

            results = await Chef.file(chef.file_id)

            const fileResult = results.rows[0]

            file = {
                ...fileResult,
                src: `${req.protocol}://${req.headers.host}${fileResult.path.replace("public", "").replace("assets", "images")}`
            }

            return res.render(`admin/chefs/show`,{
                chef,
                file,
                success: 'Chef criado com sucesso!'
            })
        } catch (err) {
            console.error(err)
            return res.render(`admin/chefs/create`,{
                error: 'Erro inesperado tente novemente mais tarde!'
            })
        }
    },
    async show(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if(!chef) {
                let results = await Chef.all()

                async function getImage(fileId) {
                    results = await Chef.file(fileId)
                    let files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path}`.replace("public", "").replace(/\\/g, "/").replace("assets","images"))
                    return files[0]
                }

                const chefPromise = results.rows.map(async chef => {
                chef.img = await getImage(chef.file_id)
                return chef
            })

            const chefs = await Promise.all(chefPromise)
                return res.render("admin/chefs/index",{
                    chefs,
                    error: 'Chef não cadastrado'
                })
            }


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

            return res.render("admin/chefs/show", {
                chef, 
                recipes, 
                file
            })
        } catch (err) {
            console.error(err)
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
            return res.render(`admin/chefs/show`,{
                chef,
                error: 'Erro inesperado tente novemente mais tarde!'
            })
        }
    },
    async edit(req, res)  {
        try {
            let results = await Chef.find(req.params.id)
            let chef = results.rows[0]
    
            if(!chef) {
                let results = await Chef.all()

                async function getImage(fileId) {
                    results = await Chef.file(fileId)
                    let files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path}`.replace("public", "").replace(/\\/g, "/").replace("assets","images"))
                    return files[0]
                }

                const chefPromise = results.rows.map(async chef => {
                chef.img = await getImage(chef.file_id)
                return chef
            })

            const chefs = await Promise.all(chefPromise)
                return res.render("admin/chefs/index",{
                    chefs,
                    error: 'Chef não cadastrado'
                })
            }

            results = await Chef.file(chef.file_id)
            let fileResult = results.rows[0]

            const file = {
                ...fileResult,
                src: `${req.protocol}://${req.headers.host}${fileResult.path.replace("public", "").replace("assets", "images")}`
            }

            return res.render("admin/chefs/edit", { chef, file })
        } catch (err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {

            let results = await Chef.find(req.body.id)
            let chef = results.rows[0]

            if (!req.file) {
                let file = await File.find(chef.id)
                req.file = file.rows[0]
            }

            const fileData = {
                name: req.file.filename,
                path: req.file.path
            }

            let file = await File.create(fileData)

            let { name } = req.body


            await Chef.update(chef.id, {
                name,
                file_id: file
            })


            results = await Chef.file(chef.file_id)

            let fileResult = results.rows[0]

            file = {
                ...fileResult,
                src: `${req.protocol}://${req.headers.host}${fileResult.path.replace("public", "").replace("assets", "images")}`
            }

            results = await Chef.find(req.body.id)
            chef = results.rows[0]

            return res.render(`admin/chefs/edit`,{
                chef,
                file,
                success: 'Chef alterado com sucesso!'
            })
        } catch (err) {
            console.error(err)

            chef = await Chef.find(req.body.id)

            results = await Chef.file(chef.file_id)
            let fileResult = results.rows[0]

            file = {
                ...fileResult,
                src: `${req.protocol}://${req.headers.host}${fileResult.path.replace("public", "").replace("assets", "images")}`
            }


            return res.render(`admin/chefs/edit`,{
                chef,
                file,
                error: 'Erro inesperado tente novamente mais tarde'
            })
        }
    },
    async delete(req, res) {
        try {
            let results = await Chef.find(req.body.id)
            let chef = results.rows[0]
            results = await Chef.all()

            async function getImage(fileId) {
                results = await Chef.file(fileId)
                let files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path}`.replace("public", "").replace(/\\/g, "/").replace("assets","images"))
                return files[0]
            }

            const chefPromise = results.rows.map(async chef => {
                chef.img = await getImage(chef.file_id)
                return chef
            })

            const chefs = await Promise.all(chefPromise)

            if (chef.total_recipes >= 1) {
                return res.render("admin/chefs/index", {
                    chefs, 
                    file,
                    alert: "Chefs com receitas não podem ser deletados!"
                })
            } else {
                await Chef.delete(req.body.id)
                
            
            return res.render("admin/chefs/index", {
                chefs, 
                file,
                success: 'Chef deletado com sucesso!'
            })
            }
        } catch (err) {
            console.error(err)
            let results = await Chef.all()

            async function getImage(fileId) {
                results = await Chef.file(fileId)
                let files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path}`.replace("public", "").replace(/\\/g, "/").replace("assets","images"))
                return files[0]
            }

            const chefPromise = results.rows.map(async chef => {
                chef.img = await getImage(chef.file_id)
                return chef
            })

            const chefs = await Promise.all(chefPromise)
            return res.render("admin/chefs/index", {
                chefs, 
                file,
                error: 'Erro inesperado tente novamente mais tarde!'
            })
        }
    }
}



