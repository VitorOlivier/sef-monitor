const path = require('path');
const mongoose = require('mongoose');

const serviceAccount = require(path.resolve(__dirname, './cfg/sef-monitor-mongoose.json'));

mongoose.connect(serviceAccount.uris, serviceAccount.options);

module.exports = mongoose;
