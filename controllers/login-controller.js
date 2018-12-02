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
	    		return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
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
		return retObj.returnErrorRes(res, bizNm + '에러!', e.message);
		
	}
});

/**
 * 소셜계정 로그인
 * @param req
 * @param res
 * @returns user object
 */ 
router.post('/social/signin', function(req, res) {
	var bizNm = '소셜로그인 ';
	log.info(bizNm + '호출 %j', req.body);
	
	try {
		
		userModel.findOne({
			userId 				: req.body.userId
			, socialType		: req.body.socialType
		}
		, function(err, user) {
			if (err) {
				log.error(bizNm + '에러!', err);
				return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
			}
			
			var param = {
		        userId 				: req.body.userId
		        , userNm 			: req.body.userNm
		        , email 			: req.body.email
		        , profileImage	 	: req.body.profileImage
		        , thumbnailImage 	: req.body.thumbnailImage
		        , ageRange		 	: req.body.ageRange
		        , birthday		 	: req.body.birthday
		        , genter		 	: req.body.genter
		        , socialType	 	: req.body.socialType
		    }
			
			//이미 가입한 계정
			if(user) {
				log.info(bizNm + '성공-이미 가입한 회원 %j', user);
				
				//기본정보 수정
				userModel.findByIdAndUpdate(user_id, param, {new: true}, function (err, user) {
					if (err) {
			    		log.error(bizNm + '에러!', err);
			    		return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
			    	}
					
					log.info('세션 생성 %s %s', user.userId, user.userNm);
					req.session.userId = user.userId;
					req.session.userNm = user.userNm;
					
					//접속로그 생성
					accessModel.insertAccessLog(req.body.userId, true, util.getClientIp(req));
					return retObj.returnSuccessRes(res, bizNm + '성공', user);
			        
			    });
				
			//가입하지 않았다면 user정보 등록
			} else {
				log.info(bizNm + '성공-최초 가입한 회원 %j', req.body);
				
				userModel.create(param, function(err, user) {
			    	if (err) {
			    		log.error(bizNm + '에러!', err);
			    		return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
			    	}
			    	log.debug('signedUser %j', user);
			    	
			    	log.info('세션 생성 %s %s', user.userId, user.userNm);
					req.session.userId = user.userId;
					req.session.userNm = user.userNm;
					
					//접속로그 생성
					accessModel.insertAccessLog(req.body.userId, true, util.getClientIp(req));
					return retObj.returnSuccessRes(res, bizNm + '성공', user);
			    });
				
			}
			
		});
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e.message);
		
	}
});

/**
 * 로그아웃
 * @param req
 * @param res
 * @returns
 */
router.post('/signout', function(req, res) {
	var bizNm = '로그아웃 ';
	log.info(bizNm + '호출 %j', req.session);
	
	try {
		
		var r = req.session.destroy();
		return retObj.returnSuccessRes(res, bizNm + '성공');
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e.message);
		
	}
	
});

/**
 * 사용자 가입
 * @param req
 * @param res
 * @returns
 */
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
	    			return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
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
		return retObj.returnErrorRes(res, bizNm + '에러!', e.message);
	}
});

module.exports = router;