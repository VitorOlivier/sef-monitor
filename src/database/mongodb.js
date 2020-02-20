const mongoose = require('mongoose');
const options = { useUnifiedTopology: true, useNewUrlParser: true };
const uris = process.env.MONGO_URL;

mongoose.connect(uris, options);

module.exports = mongoose;
