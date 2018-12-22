var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

//DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead. 설정 추가
mongoose.set('useFindAndModify', false);

var postSchema = new mongoose.Schema({
	postId				: String
    , title 			: String
    , contents			: String
    , quatation			: String
	, isPublic			: { type: Boolean, default: false }
	, tag				: [String]
	, regId				: { type: mongoose.Schema.Types.ObjectId, ref : 'user' }
	, regDate			: { type: Date, default: Date.now }
	, modDate			: { type: Date, default: Date.now }
	, todayPostDate		: String
	, postCount			: { type: Number, default: 0 }
	, isBlind			: { type: Boolean, default: false }
	, coverImage		: String
}, { collection: 'tb_post' });

postSchema.plugin(mongoosePaginate);

var post = mongoose.model('post', postSchema);
module.exports = post;