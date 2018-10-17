var mongoose = require('mongoose');

var transcribeSchema = new mongoose.Schema({
    postId 				: String
    , contents			: String
    , regId				: String
    , modDate			: { type: Date, default: Date.now }
	, completeCount		: Number
	, line		: Number
}, { collection: 'tb_transcribe' });


var transcribe = mongoose.model('transcribe', transcribeSchema);
module.exports = transcribe;