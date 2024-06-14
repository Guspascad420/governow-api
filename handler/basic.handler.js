const db = require('../config/database')

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

const createAspiration = async (req, res) => {
    try {
        let imageUrl = ''
        if (req.file && req.file.cloudStoragePublicUrl) {
            imageUrl = req.file.cloudStoragePublicUrl
        }
        req.body.imageUrl = imageUrl
        await db.collection('aspirations').add(req.body)
        res.status(201).json({message: 'successfully created aspiration'})

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
        let polls
        if (req.body.polls != null) {
            polls = req.body.polls
            await db.collection('posts').add({caption, polls, userId})
        } else {
            await db.collection('posts').add({caption, userId})
        }
        res.status(201).json({message: 'successfully created post'})
    } catch (error) {
        res.status(500).json({error: 'failed create post', message: error.message})
    }
}




module.exports = { getAllAspirations, getAllPosts, createAspiration, createPost }