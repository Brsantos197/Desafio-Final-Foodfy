const Recipe = require("../models/Recipe")
const User = require("../models/User")

function onlyUsers(req, res, next) {
    if (!req.session.userId) 
        return res.redirect('/user/login')

    next()
}

async function isLoggedRedirectToProfile(req, res, next) {
        
        if (req.session.userId) {
            let results = await User.find(req.session.userId)
            const user = results.rows
            return res.render('admin/profile/index', {user})
        }

    next()
}

async function isAdmin(req, res, next) {

    let user = await User.find(req.session.userId)

    if (user.is_admin != true) {
        return res.render('admin/profile/index', {
            user,
            alert: 'Você não tem permissão para acessar esta area'
        })
    }

    next()
}


module.exports = {
    onlyUsers,
    isLoggedRedirectToProfile,
    isAdmin
}