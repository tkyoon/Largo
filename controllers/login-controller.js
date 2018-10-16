var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:true }));

var log 		= require('../logger');
var userModel 	= require('../models/user');
var accessModel = require('../models/access');
var retVo 		= require('../models/return');

/**
 * 로그인
 * @param req
 * @param res
 * @returns user object
 */ 
router.post('/signin', function(req, res) {
	var bizNm = '로그인';
	log.info(bizNm + ' 호출 %j', req.body);
	
	if (!req.body.userId || !req.body.userPw) {
		return res.status(401).send(retVo.return(-1, '아이디 또는 비밀번호를 입력해주세요.'));
	}
	
	userModel.findOne({
        userId 				: req.body.userId
        , userPw 			: req.body.userPw
    }
    , function(err, user) {
    	if (err) {
    		log.error(bizNm + ' 에러!', err);
    		return res.status(500).send(bizNm + '에러!');
    	}
    	
    	if(user) {
    		log.error(bizNm + ' 성공 %j', user);
    		return res.status(200).send(retVo.return(1, bizNm + ' 성공', user));
    		
    	} else {
    		log.info(bizNm + ' 실패 %j', req.body);
    		insertAccessLog(req.body.userId, false, getClientIp(req));
    		return res.status(403).send(retVo.return(-1, '아이디 또는 비밀번호를 확인해주세요.'));
    		
    	}
    });
});

router.post('/signup', function(req, res) {
	var bizNm = '사용자가입';
	log.info(bizNm + ' 호출 %j', req.body);
	
	/** 필수값 확인  [TK Yoon 2018. 10. 15. 오전 9:13:46] */
	if (!req.body.userId || !req.body.userPw || !req.body.userNm) {
		return res.status(400).send(retVo.return(-1, bizNm + ' 필수값을 입력해주세요.'));
	}
	
	/** 아이디 중복 확인  [TK Yoon 2018. 10. 15. 오전 9:22:48] */
	userModel.findOne({
        userId 				: req.body.userId
    }
    , function(err, user) {
    	if (err) {
    		log.error(bizNm + ' 중복체크 에러!', err);
    		return res.status(500).send(retVo.return(-1, bizNm + ' 중복체크 에러!'));
    	}
    	
    	//아이디를 사용하고 있습니다.
    	if(user) {
    		log.info(bizNm + ' 중복체크 실패 %j', user);
    		return res.status(400).send(retVo.return(-1, '아이디를 사용하고 있습니다.'));
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
    			log.error(bizNm + ' 에러!', err);
    			return res.status(500).send(bizNm + '에러!');
    		}
    		
    		if(user) {
    			log.info(bizNm + ' 성공 %j', user);
    			return res.status(200).send(retVo.return(1, bizNm + ' 성공', user));
    			
    		} else {
    			log.info(bizNm + ' 실패 %j', req.body);
    			return res.status(403).send(retVo.return(-1, '아이디 또는 비밀번호를 확인해주세요.'));
    			
    		}
    	});
    });
	
	
});

/**
 * access log 등록
 * @param id : 사용자 아이디
 * @param isSuccess : 성공/실패, true/false
 * @param ip : 사용자 접속 아이피
 * @returns
 */
function insertAccessLog(id, isSuccess, ip){
	accessModel.create({
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

/**
 * 접속한 사용자 IP 가져오기
 * @param req
 * @returns
 */
function getClientIp(req) {
	var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
	
	return ip;
}

module.exports = router;