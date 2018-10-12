var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:true }));

var access = require('./models/access');

/**
 * 접속로그 등록
 * @param req
 * @param res
 * @returns  access object
 */ 
router.post('/', function(req, res) {
	log.info('$ 접속로그 호출 %j', req.body);
	access.create({
        userId 				: req.body.userId
        , isSuccess			: req.body.isSuccess
        , ip			 	: req.body.ip
    }
    , function(err, access) {
    	if (err) {
    		log.error('접속로그 생성 실패, %o', err);
    		return res.status(500).send('접속로그 생성 실패');
    	}
        res.status(200).send(access);
    });
});




module.exports = router;