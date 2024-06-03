const express = require('express')
const { createAspiration } = require('./routes/routes')
const { register, login, getProfile } = require('./routes/user.routes')
const app = express()

require('dotenv').config()
const port = process.env.PORT

app.use(express.json())

app.post('/user/register', register);
app.post('/user/login', login);
app.get('/user/profile', getProfile);
app.post('/aspirations', createAspiration);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
