const express = require('express');
const multer = require('multer');
const { setProfileImage, getProfileImage, deleteProfileImage } = require('../handler/edit_profile.handler');

const router = express.Router();
const upload = multer();

router.post('/profile-image', upload.single('image_profile'), setProfileImage);
router.get('/profile-image/:id', getProfileImage);
router.delete('/profile-image/:id', deleteProfileImage);

module.exports = router;
