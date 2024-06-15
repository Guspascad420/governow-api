const { Storage } = require('@google-cloud/storage');
const db = require('../config/database');
const bucketName = 'governow';

// Initialize Cloud Storage
const storage = new Storage();
const bucket = storage.bucket(bucketName);

// Upload profile image
const uploadProfileImage = async (file) => {
    console.log('Uploading file:', file.originalname);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });

    return new Promise((resolve, reject) => {
        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/profile_pictures/${blob.name}`;
            resolve(publicUrl);
        }).on('error', (err) => {
            reject(err);
        }).end(file.buffer);
    });
};

// Create or update profile image
const setProfileImage = async (req, res) => {
    try {
        const { file } = req;
        console.log('Received file:', file);
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const publicUrl = await uploadProfileImage(file);
        await db.collection('users').update({
            profile_image: publicUrl,
        });

        res.status(200).send({ message: 'successfully set profile picture', profile_image: publicUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.message);
    }
};

// Delete profile image by ID
const deleteProfileImage = async (req, res) => {
    try {
        const bearerToken = req.get("Authorization").split(' ')[1]
        const decodedClaims = JSON.parse(atob(bearerToken.split('.')[1]))
        const doc = await db.collection('users').doc(decodedClaims.userId).get()

        const profile = doc.data();
        const fileName = profile.profile_image.split('/').pop();
        await bucket.file(fileName).delete();

        await db.collection('user').doc(decodedClaims.userId).update({
            profile_image: publicUrl,
        })

        res.status(200).send('Profile image deleted.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    setProfileImage,
    deleteProfileImage,
};
