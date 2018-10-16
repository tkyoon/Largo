/**  
 * 프로젝트 시작 js  [TK Yoon 2018. 10. 12. 오전 8:25:19]
 */


/** logger tracer 사용  [TK Yoon 2018. 10. 12. 오전 10:16:18] */
var log 		= require('./util/logger');

/** mongodb-atlas 연결  [TK Yoon 2018. 10. 12. 오전 8:25:43] */
var db = require('./db');

var express = require('express');
var app = express();

/** user controller 연결  [TK Yoon 2018. 10. 12. 오전 8:25:43] */
var userController = require('./controllers/user-controller');
app.use('/users', userController);

/** 로그인 controller 연결  [TK Yoon 2018. 10. 14. 오후 10:28:43] */
var loginController = require('./controllers/login-controller');
app.use('/', loginController);


var ip 		= require("ip");
var port 	= process.env.PORT || 8600;
var server = app.listen(port, function() {
	log.info('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§');
    log.info('Largo Project Sever Started');
    log.info('Sever IP	: %s', ip.address());
    log.info('Sever Port	: %s', port);
    log.info('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§');
});

//log.info('Sever IP	: %o', server.address());
