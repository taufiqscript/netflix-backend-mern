require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/index.route')
const { MONGODB_URL } = process.env
const YAML = require('yamljs')
const swaggerDocs = YAML.load("./swagger.yaml")
const swaggerUI = require('swagger-ui-express')

const app = express()

app.use(cors());

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

app.get('/', (req, res) => {
    res.send('Backend berjalan di vercel🚀')
})

module.exports = app