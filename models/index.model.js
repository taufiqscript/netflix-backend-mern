const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: false,
        type: String
    },
    token: {
        type: String
    },
    favoriteMovies: Array
})

module.exports = {
    User: mongoose.model("User", userSchema)
}