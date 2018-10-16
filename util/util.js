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