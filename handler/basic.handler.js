const db = require('../config/database')
const dateFormat = require('dateformat')
const predictClassification = require('../utils/inference')

const getAllAspirations = async (req, res) => {
    try {
        const snapshot = await db.collection('aspirations').get()
        const data = []
        snapshot.forEach(doc => {
            data.push(doc.data())
        })
        res.status(200).json({message: 'successfully get all aspirations', data})
    } catch (error) {
        res.status(500).json({ error: 'failed', message: error.message });
    }
}

const getAllNews = async (req, res) => {
    try {
        const snapshot = await db.collection('news').get()
        const data = []
        snapshot.forEach(doc => {
            data.push(doc.data())
        })
        res.status(200).json({message: 'successfully get all news', data})
    } catch (error) {
        res.status(500).json({ error: 'failed', message: error.message });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const snapshot = await db.collection('posts').get()
        const data = []
        snapshot.forEach(doc => {
            data.push(doc.data())
        })
        res.status(200).json({message: 'successfully get all posts', data})
    } catch (error) {
        res.status(500).json({ error: 'failed', message: error.message });
    }
}

const updatePoll = async (req, res) => {
    try {
        const updatedPoll = req.body.updatedPoll
        await db.collection('posts').doc(req.params.id).update({
            polls: updatedPoll,
        })
        res.status(200).send({ message: 'successfully updated poll'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const createAspiration = async (req, res) => {
    try {
        let imageUrl = ''
        if (req.file && req.file.cloudStoragePublicUrl) {
            imageUrl = req.file.cloudStoragePublicUrl
        }
        req.body.imageUrl = imageUrl
        const category = await predictClassification(req.body.contents)
        req.body.category = category
        await db.collection('aspirations').add(req.body)
        res.status(201).json({message: 'successfully created aspiration', data: req.body})

    } catch (error) {
        res.status(500).json({ error: 'Post failed', message: error.message });
    }
}

const createPost = async (req, res) => {
    try {
        const bearerToken = req.get("Authorization").split(' ')[1]
        const decodedClaims = JSON.parse(atob(bearerToken.split('.')[1]))
        const userId = decodedClaims.userId
        const caption = req.body.caption
        const date = dateFormat(new Date(), "isoDateTime")
        let polls
        if (req.body.polls != null) {
            polls = req.body.polls
            await db.collection('posts').add({caption, polls, userId, date, like: 0})
        } else {
            await db.collection('posts').add({caption, userId})
        }
        res.status(201).json({message: 'successfully created post', data: {caption, polls, userId, date, like: 0}})
    } catch (error) {
        res.status(500).json({error: 'failed create post', message: error.message})
    }
}

const postPredictHandler = async (req, res) => {
    try {
        const results = await predictClassification(req.body.contents)
        res.status(200).json({message: 'model predicted successfully', category: results})
    } catch (error) {
        res.status(500).json({error: 'model failed to predict', message: error.message})
    }
}



module.exports = { getAllAspirations, getAllPosts, createAspiration, 
    createPost, getAllNews, postPredictHandler, updatePoll }