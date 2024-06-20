require('dotenv').config()
const Firestore = require('@google-cloud/firestore');

// create connection
const db = new Firestore();

// export connection
module.exports = db