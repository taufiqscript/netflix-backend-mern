require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./routes/index.route')
const { API_PORT, MONGODB_URL } = process.env
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocs = YAML.load('./swagger.yaml')

const app = express()

app.use(cors())
app.use(express.json())

app.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocs)
)

mongoose.connect(MONGODB_URL).catch(err => {
    if (err) {
        console.log('tidak dapat terkoneksi ke database')
        throw (err)
    } else {
        console.log("mongodb connecting..")
    }
})

app.use(router)

const PORT = API_PORT

app.listen(PORT, () => {
    console.log("server berjalan di port " + PORT)
})

module.exports = app