var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

//DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead. 설정 추가
mongoose.set('useFindAndModify', false);

var transcribeSchema = new mongoose.Schema({
    postId 				: String
    , title				: String
    , contents			: String
    , regId				: String
    , regDate			: { type: Date, default: Date.now } //글감으로 복사한 날짜
    , modDate			: { type: Date, default: Date.now } //작성자가 최종 수정한 날짜
	, completeCount		: { type: Number, default: 0 }
	, line				: { type: Number, default: 1 }
}, { collection: 'tb_transcribe' });

transcribeSchema.plugin(mongoosePaginate);

var transcribe = mongoose.model('transcribe', transcribeSchema);

module.exports = transcribe;