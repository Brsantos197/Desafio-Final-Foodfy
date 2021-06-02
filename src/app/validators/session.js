const User = require('../models/User')

async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findByEmail(email)

    if (!user) return res.render('site/user/index', {
        user: req.body,
        error: 'Usuário não encontrado!'
    })
    
    const passed = password == user.password ? true : false

    if (!passed) return res.render('site/user/index', {
        user: req.body,
        error: "Senha incorreta!"
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findByEmail(email)

        if (!user) return res.render('site/user/forgot-password', {
            user: req.body,
            error: 'Email não encontrado!'
        })

        req.user = user

        next()
    } catch (err) {
        console.error(err)
    }
}

async function reset(req, res, next) {
    try {
        // procurar o usuário
        const { email, password, passwordRepeat, token } = req.body

        let user = await User.findByEmail(email)

        if (!user) return res.render('site/user/reset-password', {
            user: req.body,
            error: 'Usuário não encontrado!'
        })
        // ver se a senha bate
        if (password !== passwordRepeat) return res.render('site/user/reset-password', {
            user: req.body,
            error: 'Senha e repetição e senha estão incorretas.'
        })
        // vereficar se o token bate
        

        if (token != user.reset_token) return res.render('site/user/reset-password', {
            user: req.body,
            token,
            error: 'Token inválido! Solicite uma nova recuperação de senha.'
        })

        // vereficar se o token não expirou
        let now = new Date()
        now = now.setHours(now.getHours())

        if (now > user.reset_token_expires) return res.render('site/user/reset-password', {
            user: req.body,
            token,
            error: 'Token expirado! Por favor solicite uma nova recuperação de senha.'
        })
        
        req.user = user

        next()
    } catch (err) {
        console.error(err)
    }
}
 
module.exports = {
    login,
    forgot,
    reset
}