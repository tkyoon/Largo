var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:true }));

var log = require('../logger');
var user = require('../models/user');
var access = require('../models/access');
var retVo = require('../models/return');

/**
 * 로그인
 * @param req
 * @param res
 * @returns user object
 */ 
router.post('/signin', function(req, res) {
	log.info('$ 로그인 호출 %j', req.body);
	
	if (!req.body.userId || !req.body.userPw) {
		return res.status(401).send(retVo.return(-1, '아이디 또는 비밀번호를 입력해주세요.'));
	}
	
    user.findOne({
        userId 				: req.body.userId
        , userPw 			: req.body.userPw
    }
    , function(err, user) {
    	if (err) {
    		log.error('로그인 에러!', err);
    		return res.status(500).send('로그인 에러!');
    	}
    	
    	if(user) {
    		log.info('$ 로그인 성공 %j', user);
    		return res.status(200).send(retVo.return(1, '로그인 성공', user));
    		
    	} else {
    		log.info('$ 로그인 실패 %j', req.body);
    		access.insertLog(req.body.userId, false, '127.0.0.1');
    		return res.status(403).send(retVo.return(-1, '아이디 또는 비밀번호를 확인해주세요.'));
    		
    	}
    });
});

module.exports = router;