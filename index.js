const express = require('express')
const { createAspiration, createPost } = require('./routes/routes')
const { register, login, getProfile } = require('./routes/user.routes')
const imgUpload = require('./utils/imgUpload')
const Multer = require('multer')
const app = express()

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

require('dotenv').config()
const port = process.env.PORT

app.use(express.json())

app.post('/user/register', register)
app.post('/user/login', login);
app.get('/user/profile', getProfile)
app.post('/post/create', createPost)
app.post('/aspirations', multer.single('attachment'), imgUpload.uploadToGcs,  createAspiration)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
