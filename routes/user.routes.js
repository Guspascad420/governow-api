const express = require('express');
const Multer = require('multer');
const imgUpload = require('../utils/imgUpload')
const { register, login, getProfile, setProfileImage, deleteProfileImage } = require('../handler/user.handler')

const router = express.Router();
const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

router.post('/register', register)
router.post('/login', login);
router.get('/profile', getProfile)
router.post('/profile-image',  multer.single('attachment'), imgUpload.uploadToGcs, setProfileImage)
router.delete('/profile-image/:id', deleteProfileImage)

module.exports = router;
