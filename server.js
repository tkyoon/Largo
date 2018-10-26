/**  
 * 프로젝트 시작 js  [TK Yoon 2018. 10. 12. 오전 8:25:19]
 */
/** logger tracer 사용  [TK Yoon 2018. 10. 12. 오전 10:16:18] */
var log 		= require('./util/logger');

/** mongodb-atlas 연결  [TK Yoon 2018. 10. 12. 오전 8:25:43] */
var db = require('./db');

var express = require('express');
var session = require('express-session');
var app = express();


/** Express Session 설정  [TK Yoon 2018. 10. 25. 오전 11:14:30] */
app.use(session({
	secret: 'blgykfmleldtut!',
	resave: false,
	saveUninitialized: true
}));

/** user controller 연결  [TK Yoon 2018. 10. 12. 오전 8:25:43] */
//var userController = require('./controllers/user-controller');
//app.use('/users', userController);

/** 로그인 login controller 연결  [TK Yoon 2018. 10. 14. 오후 10:28:43] */
var loginController = require('./controllers/login-controller');
app.use('/', loginController);

/** 글감 post controller 연결  [TK Yoon 2018. 10. 18. 오전 4:31:46] */
var postController = require('./controllers/post-controller');
app.use('/posts', postController);

/** 필사 transcribe controller 연결  [TK Yoon 2018. 10. 27. 오전 1:48:18] */
var transcribeController = require('./controllers/transcribe-controller');
app.use('/transcribes', transcribeController);

//var ip 		= require("ip");
const publicIp = require('public-ip');
var port 	= process.env.PORT || 8600;
var server = app.listen(port, function() {
	publicIp.v4().then(ip => {
    	log.info('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§');
    	log.info('Largo[Transcribe] Project Sever Started');
    	log.info('Sever IP	: %s', ip);
    	log.info('Sever Port	: %s', port);
    	log.info('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§');
    });
});

//log.info('Sever IP	: %o', server.address());
