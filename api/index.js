require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('../routes/index.route')
const { MONGODB_URL } = process.env
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const serverless = require('serverless-http')
const path = require('path')

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// Swagger setup (optional in prod)
const swaggerPath = path.join(__dirname, '..', 'swagger.yaml');
const swaggerDocs = YAML.load(swaggerPath);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

mongoose.connect(MONGODB_URL).catch(err => {
    if (err) {
        console.log('tidak dapat terkoneksi ke database')
        throw (err)
    } else {
        console.log("mongodb connecting..")
    }
})

app.use('/api', router)

app.get('/', (req, res) => {
    res.send('API Netflix Clone is running...')
})

module.exports = app
module.exports.handler = serverless(app)