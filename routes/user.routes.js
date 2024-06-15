const express = require('express');
const multer = require('multer');
const { register, login, getProfile } = require('../handler/user.handler')
const { setProfileImage, deleteProfileImage } = require('../handler/edit_profile.handler');

const router = express.Router();
const upload = multer();

router.post('/register', register)
router.post('/login', login);
router.get('/profile', getProfile)
router.post('/profile-image', upload.single('image_profile'), setProfileImage)
router.delete('/profile-image/:id', deleteProfileImage)

module.exports = router;
