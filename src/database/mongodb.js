const path = require('path');
const mongoose = require('mongoose');
const options = { useUnifiedTopology: true, useNewUrlParser: true };
const uris = process.env.MONGO_URL || 'mongodb://localhost/sef-monitor';

mongoose.connect(uris, options);

module.exports = mongoose;
