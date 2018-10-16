var mongoose = require('mongoose');
var timeZone = require('mongoose-timezone');

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
}, { collection: 'tb_user' });

userSchema.plugin(timeZone, { paths: ['regDate'] });

var user = mongoose.model('user', userSchema);
module.exports = user;