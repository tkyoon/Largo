var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:true }));

var log 		= require('../util/logger');
var util 		= require('../util/util');
var retObj 		= require('../util/return');

var transcribeModel	= require('../models/transcribe');
var postModel 		= require('../models/post');

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
		if (!req.body.postId/* || !req.body.title || !req.body.contents*/) {
			return retObj.returnBadReqRes(res, '필수값을 입력해주세요.');
		}
		
		//내가 등록한 필사의 경우 내용만 업데이트 한다.
		transcribeModel.findOne({ postId : req.body.postId, regId : req.session.userId }, function (err, transcribe) {
	    	if (err) {
	    		log.error(bizNm + '-조회 에러!', err);
				return retObj.returnErrorRes(res, bizNm + '-조회 에러!', err);
	    	}
	    	
	    	//글감 조회
    		postModel.findOne({ _id : req.body.postId }, function (err, post) {
    			if (err) {
    	    		log.error(bizNm + '-글감 조회 에러!', err);
    				return retObj.returnErrorRes(res, bizNm + '-글감 조회 에러!', err);
    	    	}
    			
    			if(null == post) {
    				return retObj.returnBadReqRes(res, '필사 등록하려는 글감이 존재하지 않아요.');
    				
    			} else {
    				log.info('등록하려는 필사 %j', transcribe);
    				log.info('등록하려는 글감 %j', post);
    				
    				//없으면 등록 
    		    	if(null == transcribe) {
    		    		log.info('XXXXX 이전에 등록한 글감이 없어요. 새로 등록합니다.');
    		    				
	    				transcribeModel.create({
	    	    			postId 				: post._id
	    	    			, title 			: post.title
	    	    			, contents 			: post.contents
	    	    		    , regId 			: req.session.userId
	    	    		}
	    	    		, function(err, transcribe) {
	    	    			if (err) {
	    	    				log.error(bizNm + '에러!', err);
	    	    				return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
	    	    			}
	    	    			
	    	    			log.info(bizNm + '성공 %j', post);
	    	    			return retObj.returnSuccessRes(res, bizNm + '성공', transcribe);
	    	    			
	    	    		});
    		    		
    	    		//있으면 contents 수정
    		    	} else {
    		    		log.info('OOOOO 이전에 등록한 글감이 있어요. 제목과 내용만 수정합니다.');
    		    		var updateObj = {
		    				title 		: post.title
	    	    			, contents 	: post.contents
	    	    			, regDate 	: new Date()
    		    		};
    		    		
    		    		transcribeModel.findOneAndUpdate({ postId : req.body.postId, regId : req.session.userId }, updateObj, {new : true}, function (err, transcribe) {
    			    		if (err) {
    			        		log.error(bizNm + '에러!', err);
    			    			return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
    			        	}
    			    		
    			    		log.info(bizNm + '성공 %j', transcribe);
    			        	return retObj.returnSuccessRes(res, bizNm + '성공', transcribe);
    			        });
    		    		
    		    	}
    				
    			}
    			
    		});
	    	
	    });
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e.message);
	}
	
});


/**
 * 필사 목록조회(로그인한 사용자)
 */
router.get('/', function(req, res) {
	var bizNm = '필사 목록조회 ';
	log.info(bizNm + '호출 %j', req.query);
	
	try {
		
		//로그인여부 체크
		if(!req.session.userId) {
			return retObj.returnBadReqRes(res, '로그인이 필요합니다.');
		}
		
		//검색조건 설정
		var cond = new Object();
		cond.regId = req.session.userId; //작성자
		//제목
		if(!req.body.title) {
			cond.title = new RegExp(req.body.title , 'i'); 
		}
		//내용
		if(!req.body.contents) {
			cond.contents = new RegExp(req.body.contents , 'i'); 
		}
		
		//페이징처리
		var rows = parseInt(req.query.rows) || 10;
		var page = 1;
		
		if(!util.isEmpty(req.query.page)){
			page = parseInt(req.query.page); 
		}
		
		var sort = { modDate : -1 }; //modDate desc 정렬
		var paging = {
			page : page
			, limit : rows
			, sort: sort
			
		};
		
		transcribeModel.paginate(cond
			, paging
			, function (err, posts) {
				if (err) {
					log.error(bizNm + '에러!', err);
					return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
				}
				
				log.info(bizNm + '성공 %j', posts);
				posts.posts = posts.docs;
				delete posts.docs;
		    	return retObj.returnSuccessRes(res, bizNm + '성공', posts);
			}
		);
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e.message);
	}
});

/**
 * 필사 저장 
 * @param req.body.line
 * @param res
 * @returns
 */
router.put('/:id', function (req, res) {
	var bizNm = '필사 저장 ';
	log.info(bizNm + '호출 %j %j', req.params, req.body);
	
	try {
		
		//로그인여부 체크
		if(!req.session.userId) {
			return retObj.returnBadReqRes(res, '로그인이 필요합니다.');
		}
		
		//라인체크
		if(!req.body.line) {
			return retObj.returnBadReqRes(res, '몇번째 라인을 필사하셨을까요?');
		}
		
		//필사 조회
		transcribeModel.findById(req.params.id, function (err, transcirbe) {
	    	if (err) {
	    		log.error(bizNm + '에러!', err);
				return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
	    	}
	    	
	    	if(transcirbe == null) {
				log.warn(bizNm + '조회 실패!(필사가 존재하지 않아요!)');
				return retObj.returnBadReqRes(res, '필사가 존재하지 않아요!');
			}
	    	
	    	log.info('저장하려는 필사정보 %j', transcirbe);
	    	
	    	if(req.session.userId != transcirbe.regId) {
	    		log.warn(bizNm + '권한 없음!(본인이 작성한 필사만 저장 가능해요)');
	    		return retObj.returnUnauthRes(res, bizNm + '권한이 없습니다!(본인이 작성한 필사만 저장 가능해요)');
	    	}
	    	
	    	req.body.modDate = new Date(); //작성자가 최종 수정한 날짜
	    	req.body.regId = req.session.userId;
	    	
	    	//수정
	    	transcribeModel.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, transcribe) {
	    		if (err) {
	        		log.error(bizNm + '에러!', err);
	    			return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
	        	}
	    		
	    		if(null == transcribe) {
	    			log.warn(bizNm + '실패!(필사가 존재하지 않아요!)');
					return retObj.returnBadReqRes(res, '필사가 존재하지 않아요!');
	    		}
	    		
	    		log.info(bizNm + '성공 %j', transcribe);
	        	return retObj.returnSuccessRes(res, bizNm + '성공', transcribe);
	        });
	    	
	    });
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e.message);
	}
	
});

/**
 * 필사 삭제
 * @param req
 * @param res
 * @returns
 */
router.delete('/:id', function (req, res) {
	var bizNm = '필사 삭제 ';
	log.info(bizNm + '호출 %j', req.params);
	
	try {
		
		//로그인여부 체크
		if(!req.session.userId) {
			return retObj.returnBadReqRes(res, '로그인이 필요합니다.');
		}
		
		//삭제자 조회
		transcribeModel.findById(req.params.id, function (err, transcribe) {
	    	if (err) {
	    		log.error(bizNm + '에러!', err);
				return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
	    	}
			
			if(transcribe == null){
				log.warn(bizNm + '실패!(필사가 존재하지 않아요!)');
				return retObj.returnBadReqRes(res, bizNm + '필사가 존재하지 않아요!');
			}
	    	
	    	if(req.session.userId != transcribe.regId) {
	    		log.warn(bizNm + '실패!(작성한 사람만 삭제할 수 있어요)');
	    		return retObj.returnUnauthRes(res, bizNm + '권한이 없습니다!(본인이 작성한 필사만 삭제 가능해요)');
	    	}
	    	
	    	//삭제 실행
	    	transcribeModel.findByIdAndRemove(req.params.id, function (err, transcribe) {
	    		if (err) {
	        		log.error(bizNm + '에러!', err);
	    			return retObj.returnErrorRes(res, bizNm + '에러!', err.message);
	        	}
	    		
	    		log.info(bizNm + '성공 %j', transcribe);
	        	return retObj.returnSuccessRes(res, bizNm + '성공', transcribe);
	        });
	    });
		
	} catch (e) {
		log.error(bizNm + '에러!(Unexpected)', e);
		return retObj.returnErrorRes(res, bizNm + '에러!', e.message);
		
	}
	
});

module.exports = router;