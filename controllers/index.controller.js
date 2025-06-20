const { User } = require('../models/index.model')
const { ERR, OK } = require('../utils/response')
const argon2 = require('argon2')

const getFavoriteMovie = async (req, res) => {
    try {
        OK(res, 200, req.user, "Getting Favorite Movie Success")
    } catch (error) {
        return ERR(res, 401, "Error Unauthorized!")
    }
}

const addFavoriteMovie = async (req, res) => {
    try {
        const { data } = req.body
        const user = await User.findById(req.user._id)

        const movieExists = user.favoriteMovies.some(movie => movie.id === data.id)
        if (movieExists) {
            return ERR(res, 400, "Movie Id is Available!")
        }

        user.favoriteMovies.push(data)
        await user.save()

        OK(res, 201, null, "Adding Favorite Movie Success")
    } catch (error) {
        return ERR(res, 401, "Error Unauthorized!")
    }
}

const checkFavoriteMovie = async (req, res) => {
    try {
        const { movieID } = req.body
        const user = await User.findById(req.user._id)

        const isFavorited = await user.favoriteMovies.some(movie => movie.id === movieID)
        return OK(res, 201, { isFavorited }, "Check Movie By Id Success")
    } catch (error) {
        return ERR(res, 400, "Error Checking Movie By Id")
    }
}

const removeFavoriteMovie = async (req, res) => {
    try {
        const { movieID } = req.body
        const user = await User.findById(req.user._id)

        const existsMovie = user.favoriteMovies.some(movie => movie.id === movieID)
        if (!existsMovie) return ERR(res, 404, "Movie Id Not Found!")

        user.favoriteMovies = user.favoriteMovies.filter(movie => movie.id !== movieID)
        await user.save()
        OK(res, 204, null, "Removing Movie Success")
    } catch (err) {
        return ERR(res, 401, "Error Unauthorized!")
    }
}

const signToken = async (req, res) => {
    try {
        const { email, password, token } = req.body

        const user = await User.findOne({ email })
        if (!user) return ERR(res, 404, "Email Not Found!")

        const isPasswordOk = await argon2.verify(user.password, password)
        if (!isPasswordOk) return ERR(res, 401, "Password Wrong!")

        user.token = token
        console.log("SIGN-IN REQ BODY:", req.body)
        await user.save()

        OK(res, 201, { token }, "Sign-In Success")
    } catch (error) {
        return ERR(res, 401, "Error Unauthorized!")
    }
}

const signUp = async (req, res) => {
    const { email, password } = req.body
    const hashPass = await argon2.hash(password)
    try {
        let user = await User.findOne({ email })
        if (user) {
            return ERR(res, 401, "Email is Available!")
        }

        const addNewUser = await new User({ email, password: hashPass })
        await addNewUser.save()

        OK(res, 201, null, "Sign-Up Success")
    } catch (error) {
        return ERR(res, 400, "Error, Sign-Up Failed!")
    }
}

const signOut = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        user.token = null
        await user.save()

        OK(res, 204, null, "Sign-Out Success")
    } catch (err) {
        return ERR(res, 400, "Error Unauthorized!")
    }
}

module.exports = {
    getFavoriteMovie,
    addFavoriteMovie,
    removeFavoriteMovie,
    signToken,
    signUp,
    signOut,
    checkFavoriteMovie
}