const { User } = require('../models/index.model')
const { ERR, OK } = require('../utils/response')
const bcrypt = require('bcrypt')

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
        if (!user) {
            console.log("❌ User not found");
            return ERR(res, 404, "Email Not Found!")
        }

        // Verifikasi password pakai bcrypt
        const passVerify = await bcrypt.compare(password, user.password)

        if (!passVerify) return ERR(res, 404, "Password Wrong")

        user.token = token

        await user.save()
            .then(() => console.log("✅ Token saved"))
            .catch(err => console.error("❌ Save failed:", err));

        OK(res, 201, null, "Sign-In Success")
    } catch (error) {
        console.error("❌ Exception:", error);
        return ERR(res, 401, "Error Unauthorized!")
    }
}

const signUp = async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (user) {
            return ERR(res, 401, "Email is Available!")
        }

        // Hash password pakai bcrypt
        const saltRounds = 10
        const hashPass = await bcrypt.hash(password, saltRounds)

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