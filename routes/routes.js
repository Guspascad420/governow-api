const db = require('../config/database')

const createAspiration = async (req, res) => {
    try {
        await db.collection('aspirations').add(req.body)
    } catch (error) {
        res.status(500).json({ error: 'Post failed', message: error.message });
    }
}



module.exports = { createAspiration }