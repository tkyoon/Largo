var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:true }));

var log 		= require('../util/logger');
var util 		= require('../util/util');
var retObj 		= require('../util/return');

var postModel 	= require('../models/post');

/**
 * 글감 등록
 * @param req
 * @param res
 * @returns user object
 */ 
router.post('/', function(req, res) {
	var bizNm = '글감 등록 ';
	log.info(bizNm + '호출 %j', req.body);
	
	//필수값 체크
	if (!req.body.title || !req.body.contents || !req.body.quatation || !req.body.regId) {
		return retObj.returnBadReqRes(res, '필수값을 입력해주세요.');
	}
	
	//tag 설정
	var tagStr = req.body.tags;
	var tags =  new Array();
	if(!util.isEmpty(tagStr)){
		var tags = tagStr.split(",");
	}
	
	//공개여부 설정
	var isPublic = false;
	if(req.body.isPublic === true || req.body.isPublic === "true"){
		isPublic = true;
	}
	
	postModel.create({
		title 				: req.body.title
		, contents 			: req.body.contents
	    , quatation 		: req.body.quatation
	    , tag	 			: tags
	    , regId 			: req.body.regId
	    , isPublic 			: isPublic
	}
	, function(err, post) {
		if (err) {
			log.error(bizNm + '에러!', err);
			return retObj.returnErrorRes(res, bizNm + '에러!', err);
		}
		
		log.info(bizNm + '성공 %j', post);
		return retObj.returnSuccessRes(res, bizNm + '성공', post);
		
	});
	
});

/**
 * 글감 목록조회
 * @param req
 * @param res
 * @returns
 */
router.get('/', function(req, res) {
	var bizNm = '글감 목록조회 ';
	log.info(bizNm + '호출 %j', req.query);
	
	//필수값 체크
//	if (!req.query.rows || !req.query.page) {
//		return retObj.returnBadReqRes(res, '필수값을 입력해주세요.[rows, page]');
//	}
	
	var rows = parseInt(req.query.rows) || 10;
	var page = 0;
	if(!util.isEmpty(req.query.page)){
		page = parseInt(req.query.page) - 1; 
	}
	
	log.debug(page)
	
	var fields = {};
	var sort = {};
	var paging = {
		skip : page * rows
		, limit : rows
	};
	
	log.debug(paging)
	
	req.query.page = null;
	req.query.rows = null;
	
	postModel.find(req.query
		, fields
		, paging
		, function (err, post) {
    	if (err) {
    		log.error(bizNm + '에러!', err);
			return retObj.returnErrorRes(res, bizNm + '에러!', err);
    	}
    	
    	log.info(bizNm + '성공 %j', post);
    	return retObj.returnSuccessRes(res, bizNm + '성공', post);
    });
});

/**
 * 글감 상세조회
 * @param req
 * @param res
 * @returns
 */
router.get('/:id', function(req, res) {
	var bizNm = '글감 상세조회 ';
	log.info(bizNm + '호출 %j', req.params);
	
	postModel.findById(req.params.id, function (err, post) {
    	if (err) {
    		log.error(bizNm + '에러!', err);
			return retObj.returnErrorRes(res, bizNm + '에러!', err);
    	}
    	
    	log.info(bizNm + '성공 %j', post);
    	return retObj.returnSuccessRes(res, bizNm + '성공', post);
    });
});

module.exports = router;