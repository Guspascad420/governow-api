const db = require('../config/database')

const createAspiration = async (req, res) => {
    try {
        let imageUrl = ''
        if (req.file && req.file.cloudStoragePublicUrl) {
            imageUrl = req.file.cloudStoragePublicUrl
        }
        req.body.imageUrl = imageUrl
        await db.collection('aspirations').add(req.body)

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




module.exports = { createAspiration, createPost }