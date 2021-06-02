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

async function post(req, res, next) {

    // check if has all fields
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/users/create', fillAllFields)
    }

    // check if user exists [email]
    let { email } = req.body
    
    const user = await User.findByEmail(email)

    if (user) return res.render(`admin/users/create`, {
        user: req.body,
        error: 'Usuário ja cadastrado.'
    })

    next()
}

async function update(req, res, next) {

    // check if has all fields
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/users/edit', fillAllFields)
    }

    // check if user exists [email]
    let { email, id } = req.body

    let oldUser = await User.find(id)
    let user = await User.findByEmail(email)

    if (user && email != oldUser.email) return res.render(`admin/users/edit`, {
        user: req.body,
        error: 'Usuário ja cadastrado.'
    })

    next()

}


module.exports = {
    post,
    update
}