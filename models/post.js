var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	postId				: String
    , title 			: String
    , contents			: String
    , quatation			: String
	, isPublic			: { type: Boolean, default: false }
	, tag				: [String]
	, regId				: String
	, regDate			: { type: Date, default: Date.now }
	, modDate			: { type: Date, default: Date.now }
	, todayPostDate		: String
	, postCount			: { type: Number, default: 0 }
	, isBlind			: { type: Boolean, default: false }
	, coverImage		: String
}, { collection: 'tb_post' });


var post = mongoose.model('post', postSchema);
module.exports = post;