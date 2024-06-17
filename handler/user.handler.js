const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../config/database')

const register = async (req, res) => {
    try {
        const { fullName, email, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('users').add({ fullName, email, username, password: hashedPassword })
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const snapshot = await db.collection('users').where('email', '==', email).get()
        const user = snapshot.docs[0].data()
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: snapshot.docs[0].id }, process.env.JWT_SECRET_KEY);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', message: error.message });
    }
}

const getProfile = async (req, res) => { 
    try {
        const bearerToken = req.get("Authorization").split(' ')[1]
        const decodedClaims = JSON.parse(atob(bearerToken.split('.')[1]))
        const doc = await db.collection('users').doc(decodedClaims.userId).get()
        const profile = doc.data()
        res.status(200).json({
            message: "successfully retrieved profile", 
            data: {"fullName": profile.fullName, "username": profile.username, "email": profile.email}
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve profile', message: error.message });
    }
}

const { Storage } = require('@google-cloud/storage');
const db = require('../config/database');
const bucketName = 'governow';

// Initialize Cloud Storage
const storage = new Storage();
const bucket = storage.bucket(bucketName);

// Create or update profile image
const setProfileImage = async (req, res) => {
    try {
        const bearerToken = req.get("Authorization").split(' ')[1]
        const decodedClaims = JSON.parse(atob(bearerToken.split('.')[1]))
        const { file } = req;
        console.log('Received file:', file);
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        let imageUrl = ''
        if (req.file && req.file.cloudStoragePublicUrl) {
            imageUrl = req.file.cloudStoragePublicUrl
        }
        console.log('uuhh: ' + imageUrl)

        await db.collection('users').doc(decodedClaims.userId).update({
            profile_image: imageUrl,
        });

        res.status(200).send({ message: 'successfully set profile picture', profile_image: imageUrl });
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


module.exports = { register, login, getProfile, setProfileImage,
    deleteProfileImage }