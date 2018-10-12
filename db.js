var mongoose = require('mongoose');
var log = require('./logger');

var uri = 'mongodb+srv://pilsa:pilsa@plisa-fuc3q.mongodb.net/pilsa_db?retryWrites=true';
/**
 const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	autoIndex: false, // Don't build indexes
	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0,
	connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	family: 4 // Use IPv4, skip trying IPv6
};*/

const options = {
	useNewUrlParser: true
};

mongoose.connect(uri, options).then(
	() => {
		/** ready to use. The `mongoose.connect()` promise resolves to undefined. */
		log.info('$$ Database connect success!');
	}
	, err => {
		/** handle initial connection error */
		log.error('$$ Database connect fail!', err);
	}
);