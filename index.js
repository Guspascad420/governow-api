const express = require('express')
const { register, login } = require('./routes/routes')
const db = require('./config/database')
const app = express()

require('dotenv').config()
const port = process.env.PORT

try {
    db.authenticate()
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', register);
app.post('/login', login);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
