const route = require('express').Router()
const userController = require('../controllers/index.controller')
const { checkToken } = require('../utils/auth')

route.get("/my-movies/:email/:token", checkToken, userController.getFavoriteMovie)
route.post("/my-movies", checkToken, userController.addFavoriteMovie)
route.delete("/my-movies", checkToken, userController.removeFavoriteMovie)
route.post('/my-movies/check', checkToken, userController.checkFavoriteMovie)

//sign-in token
route.post("/sign-in", userController.signToken)

//sign-up
route.post("/sign-up", userController.signUp)

//sign-out
route.delete("/sign-out", checkToken, userController.signOut)

module.exports = route