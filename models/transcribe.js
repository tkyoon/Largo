var mongoose = require('mongoose');

var transcribeSchema = new mongoose.Schema({
    postId 				: String
    , title				: String
    , contents			: String
    , regId				: String
    , modDate			: { type: Date, default: Date.now }
	, completeCount		: { type: Number, default: 0 }
	, line				: { type: Number, default: 1 }
}, { collection: 'tb_transcribe' });

var transcribe = mongoose.model('transcribe', transcribeSchema);

module.exports = transcribe;