var mongoose 	= require('mongoose');
var log 		= require('../util/logger');

var accessSchema = new mongoose.Schema({
    userId 				: String
    , ip			 	: String
    , isSuccess			: { type: Boolean, default: false }
	, accessDate		: { type: Date, default: Date.now }
}, { collection: 'tb_access' });


var access = mongoose.model('access', accessSchema);
module.exports = access;

/**
 * access log 등록
 * @param id : 사용자 아이디
 * @param isSuccess : 성공/실패, true/false
 * @param ip : 사용자 접속 아이피
 * @returns
 */
module.exports.insertAccessLog = function (id, isSuccess, ip){
	access.create({
		userId: id
		, isSuccess : isSuccess
        , ip : ip
    }
    , function(err, user) {
        if (err) {
        	log.error('접속로그 저장 실패!', err);
        }
        
        log.info('$ 접속로그 저장 %s, %s, %s', id, isSuccess, ip);
    });
}