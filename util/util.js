var log 		= require('./logger');

/**
 * 접속한 사용자 IP 가져오기
 * @param req
 * @returns
 */
exports.getClientIp = function(req) {
	var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
	
	return ip;
}

//로컬시간 구하기
//var local = new Date( user.regDate.getTime() -  ( new Date().getTimezoneOffset() * 60000 ) )
//log.debug(local);