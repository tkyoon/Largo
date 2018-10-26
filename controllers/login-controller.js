var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:true }));

var log 		= require('../util/logger');
var util 		= require('../util/util');
var userModel 	= require('../models/user');
var accessModel = require('../models/access');
var retObj		= require('../util/return');

/**
 * 로그인
 * @param req
 * @param res
 * @returns user object
 */ 
router.post('/signin', function(req, res) {
	var bizNm = '로그인 ';
	log.info(bizNm + '호출 %j', req.body);
	
	try {
		
		if (!req.body.userId || !req.body.userPw) {
			return retObj.returnBadReqRes(res, '아이디 또는 비밀번호를 입력해주세요.');
		}
		
		userModel.findOne({
	        userId 				: req.body.userId
	        , userPw 			: req.body.userPw
	        , isLeave 			: false
	    }
	    , function(err, user) {
	    	if (err) {
	    		log.error(bizNm + '에러!', err);
	    		return retObj.returnErrorRes(res, bizNm + '에러!', err);
	    	}
	    	
	    	if(user) {
	    		log.info(bizNm + '성공 %j', user);
	    		accessModel.insertAccessLog(req.body.userId, true, util.getClientIp(req));
	    		
	    		log.info('세션 생성 %s %s', user.userId, user.userNm);
	    		req.session.userId = user.userId;
	    		req.session.userNm = user.userNm;
	    		return retObj.returnSuccessRes(res, bizNm + '성공', user);
	    		
	    	} else {
	    		log.warn(bizNm + '실패 %j', req.body);
	    		accessModel.insertAccessLog(req.body.userId, false, util.getClientIp(req));
	    		return retObj.returnUnauthRes(res, '아이디 또는 비밀번호를 확인해주세요.');
	    		
	    	}
	    	
	    });
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e);
		
	}
	
	
});

router.post('/signup', function(req, res) {
	var bizNm = '사용자가입 ';
	log.info(bizNm + '호출 %j', req.body);
	
	try {
		
		/** 필수값 확인  [TK Yoon 2018. 10. 15. 오전 9:13:46] */
		if (!req.body.userId || !req.body.userPw || !req.body.userNm) {
			return retObj.returnBadReqRes(res, '필수값을 입력해주세요.');
		}
		
		/** 아이디 중복 확인  [TK Yoon 2018. 10. 15. 오전 9:22:48] */
		userModel.findOne({
	        userId 				: req.body.userId
	    }
	    , function(err, user) {
	    	if (err) {
	    		log.error(bizNm + '중복체크 에러!', err);
	    		return retObj.returnErrorRes(res, bizNm + '중복체크 에러!', err);
	    	}
	    	
	    	//아이디를 사용하고 있습니다.
	    	if(user) {
	    		log.warn(bizNm + '중복체크 실패 %j', user);
	    		return retObj.returnBadReqRes(res, '아이디를 사용하고 있습니다.');
	    	}
	    	
	    	userModel.create({
	    		userId 				: req.body.userId
	    		, userPw 			: req.body.userPw
	    	    , userNm 			: req.body.userNm
	    	    , profileImage	 	: req.body.profileImage
	    	    , thumbnailImage 	: req.body.thumbnailImage
	    	    , ageRange		 	: req.body.ageRange
	    	    , birthday		 	: req.body.birthday
	    	    , genter		 	: req.body.genter
	    	    , socialType	 	: req.body.socialType
	    	}
	    	, function(err, user) {
	    		if (err) {
	    			log.error(bizNm + '에러!', err);
	    			return retObj.returnErrorRes(res, bizNm + '에러!', err);
	    		}
	    		
	    		if(user) {
	    			log.info(bizNm + '성공 %j', user);
	    			return retObj.returnSuccessRes(res, bizNm + '성공', user);
	    			
	    		} else {
	    			log.warn(bizNm + '실패 %j', req.body);
	    			return retObj.returnUnauthRes(res, '아이디 또는 비밀번호를 확인해주세요.');
	    			
	    		}
	    	});
	    });
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e);
	}
	
	
	
	
});

module.exports = router;