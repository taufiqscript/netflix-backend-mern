require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/index.route')
const { MONGODB_URL } = process.env
const YAML = require('yamljs')
const swaggerDocs = YAML.load("./swagger.yaml")
const swaggerUI = require('swagger-ui-express')

const PORT = process.env.PORT || 3002

const app = express()

app.use(cors({
    origin: 'https://netflix-clone-lyart-five-36.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json())

app.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocs)
);

mongoose.set('strictQuery', true)

mongoose.connect(MONGODB_URL).catch(err => {
    if (err) {
        console.log('tidak dapat terkoneksi ke database')
        throw (err)
    } else {
        console.log("mongodb connecting..")
    }
})

app.use(routes)

app.listen(PORT, () => {
    console.log("server berjalan di port " + PORT)
})

module.exports = app