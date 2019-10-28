const path = require('path');
const admin = require('firebase-admin');

const serviceAccount = require(path.resolve(__dirname, './cfg/sef-monitor-firebase.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sef-monitor.firebaseio.com',
});

module.exports.db = admin.firestore();

module.exports.Timestamp = admin.firestore.Timestamp;
