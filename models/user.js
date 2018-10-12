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
}, { collection: 'tb_user' });

mongoose.model('user', userSchema);
module.exports = mongoose.model('user');