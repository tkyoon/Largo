var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userId 				: String
    , userPw 			: String
    , userNm 			: String
    , profileImage	 	: String
    , thumbnailImage 	: String
    , ageRange		 	: String
    , birthday		 	: String
    , genter		 	: String
    , socialType	 	: String
    , isLeave		 	: { type: Boolean, default: false } //탈퇴여부
	, regDate		 	: { type: Date, default: Date.now }
//	, _id: {type: mongoose.Schema.Types.ObjectId, auto: true} //리턴값에 _id 넘어옴 
}
, {
	collection: 'tb_user' 
//	, _id: false
});

var user = mongoose.model('user', userSchema);
module.exports = user;