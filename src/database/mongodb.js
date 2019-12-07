const path = require('path');
const mongoose = require('mongoose');

//const serviceAccount = require(path.resolve(__dirname, './cfg/sef-monitor-mongoose.json'));

mongoose.connect('mongodb://localhost/sef-monitor', { useUnifiedTopology: true, useNewUrlParser: true });

module.exports = mongoose;
