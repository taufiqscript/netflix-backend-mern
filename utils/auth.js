const { User } = require('../models/index.model')
const { ERR } = require('./response')

const checkToken = async (req, res, next) => {
    const email = req.body?.email || req.params?.email
    const token = req.body?.token || req.params?.token

    try {
        const user = await User.findOne({ email, token })

        if (!user) {
            return ERR(res, 401, "Error Unauthorized!")
        }

        req.user = user
        await next()
    } catch (err) {
        return ERR(res, 500, "Internal Server Error!")
    }
}

module.exports = { checkToken }