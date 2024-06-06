// eslint-disable 
const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const serviceAccountPath = path.resolve(__dirname, 'serviceaccountkey.json');

const firestore = new Firestore({
    projectId: 'bangkit-capstone-425011', 
    keyFilename: serviceAccountPath,
});

const storage = new Storage({
    projectId: 'bangkit-capstone-425011',
    keyFilename: serviceAccountPath,
});

const bucketName = 'governow'; 
const bucket = storage.bucket(bucketName);

module.exports = { firestore, bucket };