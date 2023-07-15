require('dotenv').config()
const express = require('express')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.get('/', (req, res) => {
    console.log("Hello World!")
    res.json({ msg: "Hi There"})
})

app.listen(process.env.PORT, () => {
    console.log("Listening on Port: ", process.env.PORT)
})