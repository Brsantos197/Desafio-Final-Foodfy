const User = require('../models/User')

module.exports = {
    async index(req, res) {
        let results = await User.findById(1)
        const user = results.rows[0]

        return res.render('admin/profile/index', { user })
    },
    async put(req, res) {
        try {
            await User.updateProfile(req.body)

            const user = req.body

            return res.render('admin/profile/index', { 
                user,
                success: 'Alterado com sucesso!'
            } )

        } catch (err) {
            console.error(err)
        }
    }
}



