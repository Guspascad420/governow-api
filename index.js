const express = require('express')
const { createAspiration, createPost, getAllPosts, getAllAspirations } = require('./handler/basic.handler')
const { register, login, getProfile } = require('./handler/user.handler')
const imgUpload = require('./utils/imgUpload')
const Multer = require('multer')
const app = express()
const leaders = require('./routes/leader.routes')

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

require('dotenv').config()
const port = process.env.PORT

app.use(express.json())
app.use(leaders)

app.post('/user/register', register)
app.post('/user/login', login);
app.get('/user/profile', getProfile)
app.get('/post/all', getAllPosts)
app.get('/aspirations/all', getAllAspirations)
app.post('/post/create', createPost)
app.post('/aspirations', multer.single('attachment'), imgUpload.uploadToGcs,  createAspiration)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
