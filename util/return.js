/**
 * Return VO, Return Response 객체 생성
 * 리턴 형식 {
 * 	code : Number
 * 	, msg : String
 * 	, data : Object
 * }
 */

/**
 * 성공 response
 * Http Status 200
 */
exports.returnSuccessRes = function (res, m, d) {
	return res.status(200).send(returnData(1, m, d));
};

/**
 * 에러 response
 * Http Status 500
 */
exports.returnErrorRes = function (res, m, d) {
	return res.status(500).send(returnData(-1, m, d));
};

/**
 * 권한없음 response
 * Http Status 403
 */
exports.returnUnauthRes = function (res, m, d) {
	return res.status(403).send(returnData(-1, m, d));
};

/**
 * 잘못된 요청 response
 * Http Status 400
 */
exports.returnBadReqRes = function (res, m, d) {
	return res.status(400).send(returnData(-1, m, d));
};

/**
 * response data 생성
 */
function returnData(cd, m, d) {
	var ret = new Object();
	ret.code = cd;
	ret.msg = m;
	ret.data = d;
	return ret
};

