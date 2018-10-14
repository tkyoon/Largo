var mongoose = require('mongoose');
var log = require('../logger');

var accessSchema = new mongoose.Schema({
    userId 				: String
    , accessDate		: String
    , isSuccess			: { type: Boolean, default: false }
    , ip			 	: String
}, { collection: 'tb_access' });


var access = mongoose.model('access', accessSchema);
module.exports = access;

/**
 * access insert service
 */
exports.insertLog = function(userId, isSuccess, ip) {
	access.create({
		userId: userId
		, isSuccess : isSuccess
        , ip : ip
    }
    , function(err, user) {
        if (err) {
        	log.error('접속로그 저장 실패!', err);
        }
    });
};




