const path = require('path');
const pathKey = path.resolve('./serviceaccountkey.json')
const Firestore = require('@google-cloud/firestore');

// create connection
const db = new Firestore({
    projectId: 'bangkit-capstone-425011',
    keyFilename: pathKey,
});

// export connection
module.exports = db