var mongoose = require('mongoose');
var timeZone = require('mongoose-timezone');

var accessSchema = new mongoose.Schema({
    userId 				: String
    , ip			 	: String
    , isSuccess			: { type: Boolean, default: false }
	, accessDate		: { type: Date, default: Date.now }
}, { collection: 'tb_access' });

accessSchema.plugin(timeZone, { paths: ['accessDate'] });

var access = mongoose.model('access', accessSchema);
module.exports = access;