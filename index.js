const express = require('express')
const { createAspiration, createPost, getAllPosts, getPost,
    getAllAspirations, getAllNews, postPredictHandler, updatePoll } = require('./handler/basic.handler')
const imgUpload = require('./utils/imgUpload')
const Multer = require('multer')
const app = express()
const leaders = require('./routes/leader.routes')
const user = require('./routes/user.routes')

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

require('dotenv').config()
const port = process.env.PORT

app.use(express.json())
app.use('leaders', leaders)
app.use('/user', user)

app.get('/post/all', getAllPosts)
app.put('/post/:id/poll/update', updatePoll)
app.get('/post/:id', getPost)
app.get('/aspirations/all', getAllAspirations)
app.get('/news/all', getAllNews)
app.post('/post/create', createPost)
app.post('/aspirations', multer.single('attachment'), imgUpload.uploadToGcs,  createAspiration)
app.post('/predict', postPredictHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
