const mailer = require('../../lib/mailer')
const crypto = require('crypto')
const User = require('../models/User')

module.exports = {
    async list(req, res) {
        try {
            let results = await User.all()
            const users = results.rows

            const sessionUser = await User.find(req.session.userId)

            return res.render('admin/users/index', { users, sessionUser })
        } catch (err) {
            console.error(err)
        }
    },
    async edit(req, res) {
        try {
            let user = await User.find(req.params.id)
    
            return res.render('admin/users/edit', { user })
        } catch (err) {
            console.error(err)
        }
    },
    async create(req, res) {
        try {
            return res.render('admin/users/create')
        } catch (err) {
            console.error(err)
        }
    },
    async post(req, res) {
        try {
            const password = crypto.randomBytes(4).toString('hex')

            let user = {
                ...req.body,
                password
            }

            const userId = await User.create(user)
            user = await User.find(userId)

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Senha de usuário',
                html: `<h1>Olá ${user.name}</h1>
                <h2>Aqui está a sua senha de usuário do foodfy</h2>
                <p>${user.password}</p>
                <p>Clique no link abaixo para logar</p>
                <p>
                    <a href="http://localhost:3000/user/login">
                        LOGAR NO FOODFY
                    </a>
                </p>
                `
                
            })

            results = await User.all()
            const users = results.rows

            return res.render('admin/users/index',{
                users, 
                success: "Email com senha gerada enviado para usuário!"
            })
        } catch (err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            await User.update(req.body.id, req.body)
            let results = await User.all()
            const users = results.rows

            return res.render('admin/users/index',{
                users,
                success: 'Usuário alterado com sucesso!'
            })
        } catch (err) {
            console.error(err)
            let user = await User.find(req.body.id)
            return res.render('admin/users/edit', {
                user,
                error: 'Algum erro aconteceu tente novamente'
            })
        }
    },
    async delete(req, res) {
        try {
            let user = await User.find(req.body.id)

            if (user.is_admin == true ) {

            return res.render('admin/users/edit', {
                user,
                alert: 'Você não tem permissão para realizar esta ação'
            })

            }
            await User.delete(req.body.id)

            results = await User.all()
            const users = results.rows

            return res.render('admin/users/index', {
                users,
                success: 'Usuário deletado com sucesso!'
            })
        } catch (err) {
            console.error(err)
            let results = await User.all()
            const users = results.rows
            return res.render('admin/users/index', {
                users,
                error: 'Algum erro aconteceu tente novamente'
            })
        }
    },
    async deleteDashBoard(req, res) {
        try {
            let user = await User.find(req.params.id)

            if (user.is_admin == true ) {

            return res.render('admin/users/edit', {
                user,
                alert: 'Você não tem permissão para realizar esta ação'
            })

            }
            await User.delete(req.params.id)

            results = await User.all()
            const users = results.rows

            return res.render('admin/users/index', {
                users,
                success: 'Usuário deletado com sucesso!'
            })
        } catch (err) {
            console.error(err)
            let results = await User.all()
            const users = results.rows
            return res.render('admin/users/index', {
                users,
                error: 'Algum erro aconteceu tente novamente'
            })
        }
}
}



