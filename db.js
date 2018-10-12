var mongoose = require('mongoose');
var uri = "mongodb+srv://pilsa:pilsa@plisa-fuc3q.mongodb.net/pilsa_db?retryWrites=true";

mongoose.connect(uri, { useNewUrlParser: true });