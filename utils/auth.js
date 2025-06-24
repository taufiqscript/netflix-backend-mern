const { User } = require('../models/index.model')
const { ERR } = require('./response')

const checkToken = async (req, res, next) => {
    const email = req.body?.email || req.params?.email
    const token = req.body?.token || req.params?.token

    if (!email || !token) {
        return ERR(res, 401, "Error Unauthorized!")
    }

    try {
        const user = await User.findOne({ email, token })

        if (!user) {
            return ERR(res, 401, "Email Or Token Not Available!")
        }
        req.user = user
        await next()
    } catch (err) {
        return ERR(res, 400, "Error can't check token!")
    }
}

module.exports = { checkToken }