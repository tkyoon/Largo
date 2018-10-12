/**  
 * 프로젝트 시작 js  [TK Yoon 2018. 10. 12. 오전 8:25:19]
 */


/** logger tracer 사용  [TK Yoon 2018. 10. 12. 오전 10:16:18] */
var log = require('./logger');

/** mongodb-atlas 연결  [TK Yoon 2018. 10. 12. 오전 8:25:43] */
var db = require('./db');

var express = require('express');
var app = express();

/** user controller 연결  [TK Yoon 2018. 10. 12. 오전 8:25:43] */
//var UserController = require('./user/UserController');
//app.use('/users', UserController);


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
