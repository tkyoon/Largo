var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:true }));

var log 		= require('../util/logger');
var util 		= require('../util/util');
var retObj 		= require('../util/return');

var transcribeModel 	= require('../models/transcribe');
var postModel 	= require('../models/post');

/**
 * 필사 등록
 * @param req
 * @param res
 * @returns
 */
router.post('/', function(req, res) {
	var bizNm = '필사 등록 ';
	log.info(bizNm + '호출 %j', req.body);
	
	try {
		
		//로그인여부 체크
		if(!req.session.userId) {
			return retObj.returnBadReqRes(res, '로그인이 필요합니다.');
		}
		
		//필수값 체크
		if (!req.body.postId || !req.body.contents) {
			return retObj.returnBadReqRes(res, '필수값을 입력해주세요.');
		}
		
		//내가 등록한 필사의 경우 내용만 업데이트 한다.
		transcribeModel.findOne({ postId : req.body.postId }, function (err, transcribe) {
	    	if (err) {
	    		log.error(bizNm + '-조회 에러!', err);
				return retObj.returnErrorRes(res, bizNm + '-조회 에러!', err);
	    	}
	    	
	    	//글감 조회
    		postModel.findOne({ postId : req.body.postId }, function (err, post) {
    			if (err) {
    	    		log.error(bizNm + '-글감 조회 에러!', err);
    				return retObj.returnErrorRes(res, bizNm + '-글감 조회 에러!', err);
    	    	}
    			
    			if(null == post) {
    				return retObj.returnBadReqRes(res, '필사 등록하려는 글감이 존재하지 않아요.');
    				
    			} else {
    				log.info('등록하려는 글감 %j', post);
    				
    				//없으면 등록 
    		    	if(null == transcribe) {
    		    		log.info('이전에 등록한 글감이 없어요. 새로 등록합니다.');
    		    				
	    				transcribeModel.create({
	    	    			postId 				: post.postId
	    	    			, title 			: post.title
	    	    			, contents 			: post.contents
	    	    		    , regId 			: req.session.userId
	    	    		}
	    	    		, function(err, post) {
	    	    			if (err) {
	    	    				log.error(bizNm + '에러!', err);
	    	    				return retObj.returnErrorRes(res, bizNm + '에러!', err);
	    	    			}
	    	    			
	    	    			log.info(bizNm + '성공 %j', post);
	    	    			return retObj.returnSuccessRes(res, bizNm + '성공', post);
	    	    			
	    	    		});
    		    		
    		    		
    	    		//있으면 contents 수정
    		    	} else {
    		    		log.info('이전에 등록한 글감이 있어요. 제목과 내용만 수정합니다.');
    		    		var updateObj = {
		    				title 		: post.title
	    	    			, contents 	: post.contents
    		    		};
    		    		
    		    		postModel.UpdateOne({ postId : req.body.postId }, updateObj, {new: true}, function (err, post) {
    			    		if (err) {
    			        		log.error(bizNm + '에러!', err);
    			    			return retObj.returnErrorRes(res, bizNm + '에러!', err);
    			        	}
    			    		
    			    		log.info(bizNm + '성공 %j', post);
    			        	return retObj.returnSuccessRes(res, bizNm + '성공', post);
    			        });
    		    		
    		    	}
    				
    			}
    			
    		});
	    	
	    });
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e);
	}
	
	
	
});



















/**
 * 글감 등록
 * @param req
 * @param res
 * @returns user object
 */ 
router.post('/', function(req, res) {
	var bizNm = '글감 등록 ';
	log.info(bizNm + '호출 %j', req.body);
	
	//로그인여부 체크
	if(!req.session.userId) {
		return retObj.returnBadReqRes(res, '로그인이 필요합니다.');
	}
	
	//필수값 체크
	if (!req.body.title || !req.body.contents || !req.body.quatation) {
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
	    , regId 			: req.session.userId
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
	
	try {
		
		var rows = parseInt(req.query.rows) || 10;
		var page = 1;
		
//		mongoose-paginate 사용하지 않을 경우 skip 0부터 시작일 경우
		if(!util.isEmpty(req.query.page)){
			page = parseInt(req.query.page); 
		}
		
		var fields = {};
		var sort = { modDate : -1 }; //modDate desc 정렬
		var paging = {
			page : page
			, limit : rows
			, sort: sort
			
		};
		
		//검색조건에 들어가지 않도록 null 처리
		req.query.page = null;
		req.query.rows = null;
		
		postModel.paginate(req.query
			, paging
			, function (err, posts) {
				if (err) {
					log.error(bizNm + '에러!', err);
					return retObj.returnErrorRes(res, bizNm + '에러!', err);
				}
				
				log.info(bizNm + '성공 %j', posts);
				posts.posts = posts.docs;
				delete posts.docs;
		    	return retObj.returnSuccessRes(res, bizNm + '성공', posts);
			}
		);
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e);
	}
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
	
	try {
		
		postModel.findById(req.params.id, function (err, post) {
	    	if (err) {
	    		log.error(bizNm + '에러!', err);
				return retObj.returnErrorRes(res, bizNm + '에러!', err);
	    	}
	    	
	    	log.info(bizNm + '성공 %j', post);
	    	return retObj.returnSuccessRes(res, bizNm + '성공', post);
	    });
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e);
		
	}
	
});

/**
 * 글감 수정
 * @param req
 * @param res
 * @returns
 */
router.put('/:id', function (req, res) {
	var bizNm = '글감 수정 ';
	log.info(bizNm + '호출 %j %j', req.params, req.body);
	
	try {
		
		//로그인여부 체크
		if(!req.session.userId) {
			return retObj.returnBadReqRes(res, '로그인이 필요합니다.');
		}
		
		//수정자 조회
		postModel.findById(req.params.id, function (err, post) {
	    	if (err) {
	    		log.error(bizNm + '에러!', err);
				return retObj.returnErrorRes(res, bizNm + '에러!', err);
	    	}
	    	
	    	if(post == null){
				log.info(bizNm + '조회 실패!(글감이 존재하지 않아요)');
				return retObj.returnBadReqRes(res, bizNm + '글감이 존재하지 않아요!');
			}
	    	
	    	if(req.session.userId != post.regId) {
	    		return retObj.returnUnauthRes(res, bizNm + '권한이 없습니다!(본인이 작성한 글감만 수정 가능해요.)');
	    	}
	    	
	    	req.body.modDate = new Date();
	    	//수정
	    	postModel.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
	    		if (err) {
	        		log.error(bizNm + '에러!', err);
	    			return retObj.returnErrorRes(res, bizNm + '에러!', err);
	        	}
	    		
	    		log.info(bizNm + '성공 %j', post);
	        	return retObj.returnSuccessRes(res, bizNm + '성공', post);
	        });
	    	
	    });
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e);
	}
	
});

/**
 * 글감삭제
 * @param req
 * @param res
 * @returns
 */
router.delete('/:id', function (req, res) {
	var bizNm = '글감 삭제 ';
	log.info(bizNm + '호출 %j', req.params);
	
	try {
		
		//로그인여부 체크
		if(!req.session.userId) {
			return retObj.returnBadReqRes(res, '로그인이 필요합니다.');
		}
		
		//삭제자 조회
		postModel.findById(req.params.id, function (err, post) {
	    	if (err) {
	    		log.error(bizNm + '에러!', err);
				return retObj.returnErrorRes(res, bizNm + '에러!', err);
	    	}
			
			if(post == null){
				log.info(bizNm + '조회 실패!(글감이 존재하지 않아요)');
				return retObj.returnBadReqRes(res, bizNm + '글감이 존재하지 않아요!');
			}
	    	
	    	if(req.session.userId != post.regId) {
	    		log.info(bizNm + '실패!(작성자와 삭제자가 일치하지 않아요)');
	    		return retObj.returnUnauthRes(res, bizNm + '권한이 없습니다!(본인이 작성한 글감만 삭제 가능해요)');
	    	}
	    	
	    	//삭제 실행
	    	postModel.findByIdAndRemove(req.params.id, function (err, post) {
	    		if (err) {
	        		log.error(bizNm + '에러!', err);
	    			return retObj.returnErrorRes(res, bizNm + '에러!', err);
	        	}
	    		
	    		log.info(bizNm + '성공 %j', post);
	        	return retObj.returnSuccessRes(res, bizNm + '성공', post);
	        });
	    });
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e);
		
	}
	
});


module.exports = router;