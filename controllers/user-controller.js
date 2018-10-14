var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:true }));

var log = require('../logger');
var user = require('../models/user');

/**
 * 사용자 등록
 * @param req
 * @param res
 * @returns user object
 */ 
router.post('/', function(req, res) {
	log.info('$ 사용자등록 호출 %j', req.body);
    user.create({
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
    		log.error('사용자등록 실패!', err);
    		return res.status(500).send('사용자등록 실패!');
    	}
        res.status(200).send(user);
    });
});

/**
 * 사용자 조회 
 * @param req
 * @param res
 * @returns
 */
router.get('/', function(req, res) {
	log.info('$ 사용자조회 호출 %j', req.params);
    user.find( {}, function(err, users) {
    	if (err) {
    		log.error('사용자조회 실패!', err);
    		return res.status(500).send('사용자조회 실패!');
    	}
        res.status(200).send(users);
    });
});

/**
 * 사용자 상세 조회 
 * @param req
 * @param res
 * @returns
 */
router.get('/:id', function(req, res) {
	log.info('$ 사용자 상세조회 호출 %j', req.params);
    user.findById(req.params.id, function (err, user) {
    	if (err) {
    		log.error('사용자 상세조회 실패!', err);
    		return res.status(500).send('사용자상세조회 실패!');
    	}
        if (!user) return res.status(404).send("User 없음.");
        res.status(200).send(user);
    });
});

/**
 * 사용자 정보 수정 
 * @param req
 * @param res
 * @returns
 */
router.put('/:id', function (req, res) {
	user.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("User 수정 실패.");
        res.status(200).send(user);
    });
});

/**
 * 사용자 탈퇴 
 * @param req
 * @param res
 * @returns
 */
router.delete('/:id', function (req, res) {
	user.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("User 삭제 실패");
        res.status(200).send("User "+ user.name +" 삭제됨.");
    });
});



module.exports = router;