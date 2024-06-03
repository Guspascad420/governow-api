const express = require('express')
const { register, login } = require('./routes/routes')
const db = require('./config/database')
const app = express()

require('dotenv').config()
const port = process.env.PORT

app.use(express.json())

app.post('/register', register);
app.post('/login', login);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
