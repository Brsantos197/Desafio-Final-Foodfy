const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const Recipe = require('../models/Recipe')

module.exports = {
    loginForm(req, res) {
        return res.render('site/user/index')
    },
    login(req, res) {
        req.session.userId = req.user.id

        const user = req.user

        return res.render('admin/profile/index', {
            user,
            success: 'Bem Vindo. Logado com sucesso!'
        })
    },
    async logout(req, res) {
        req.session.destroy()
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

        return res.render("site/index", {
            recipes,
            success: 'Deslogado com sucesso, até mais!'
        })
    },
    forgotForm(req, res) {
        return res.render('site/user/forgot-password')
    },
    async forgot(req, res) {
        try {
            const user = req.user
            // um token para esse usuário
            const token = crypto.randomBytes(20).toString("hex")

            // criar uma expiração
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user, {
                reset_token: token,
                reset_token_expires: now
            })

            // enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar a sua senha</p>
                <p>
                    <a href="http://localhost:3000/user/reset-password?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `,
            })

            // avisar o usuário que enviamos o email
            return res.render('site/user/forgot-password', {
                success: "Verifique seu email para resetar sua senha"
            })
        } catch (err) {
            console.error(err)
            res.render('site/user/forgot-password', {
                error: 'Erro inesperado, tente novamente'
            })
        }
    },
    resetForm(req, res) {
        return res.render('site/user/reset-password', { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user

        const { password, token } = req.body
        
        try {
            // atualiza o usuário
            await User.update(user.id, {
                password: password,
                reset_token: "",
                reset_token_expires: ""
            })
            // avisa o usuário que ele tem uma nova senha
            return res.render('site/user/index', {
                user: req.body,
                success: 'Senha atualizada! Faça o seu login'
            })

        } catch (err) {
            console.error(err)
            res.render('site/user/reset-password', {
                user: req.body,
                token,
                error: 'Erro inesperado, tente novamente'
            })
        }
    }
}



