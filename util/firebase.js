const admin = require('firebase-admin');
const path = require('path');

// Correct path to the service account JSON
const serviceAccount = require(path.join(__dirname, 'ydkadmin-firebase-adminsdk-fbsvc-2d15ed21b1.json'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ydkadmin-default-rtdb.firebaseio.com/', 
});

// Initialize Realtime Database
const database = admin.database();

module.exports = { database };
