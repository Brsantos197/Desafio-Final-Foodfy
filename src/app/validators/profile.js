const User = require('../models/User')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
         if (body[key] == "") return  {
            user: body,
            error: 'Por favor, preencha todos os campos'
        }
    }
}

async function update(req, res, next) {

    // check if has all fields
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/profile/index', fillAllFields)
    }

    // check if user exists [email] and has password
    let { email, password } = req.body
    
    const user = await User.findByEmail(email)

    if (user && user.email != email) return res.render(`admin/profile/index`, {
        user: req.body,
        error: 'Usuário ja cadastrado.'
    })

    // and has password

    if (!password) return res.render('admin/profile/index', {
        user: req.body,
        error: "Coloque sua senha para atualizar seu cadastro."
    })

    // password match

    const passed = password == user.password ? true : false

    if (!passed) return res.render('admin/profile/index', {
        user: req.body,
        error: "Senha incorreta!"
    })

    next()
}


module.exports = {
    update
}