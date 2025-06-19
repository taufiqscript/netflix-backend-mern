const OK = (res, statusCode, data, message) => {
    res.status(statusCode).json({ isError: false, data, message })
}

const ERR = (res, statusCode, message) => {
    res.status(statusCode).json({ isError: true, message })
}

module.exports = { ERR, OK }