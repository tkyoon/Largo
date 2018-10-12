var mongoose = require('mongoose');
var accessSchema = new mongoose.Schema({
    userId 				: String
    , accessDate		: String
    , isSuccess			: { type: Boolean, default: false }
    , ip			 	: String
}, { collection: 'tb_access' });

mongoose.model('access', accessSchema);
module.exports = mongoose.model('access');