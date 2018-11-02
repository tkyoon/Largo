/**  
 * 프로젝트 시작 js  [TK Yoon 2018. 10. 12. 오전 8:25:19]
 */
/** logger tracer 사용  [TK Yoon 2018. 10. 12. 오전 10:16:18] */
const log 		= require('./util/logger');

/** mongodb-atlas 연결  [TK Yoon 2018. 10. 12. 오전 8:25:43] */
const db = require('./db');

const express = require('express');
const session = require('express-session');
const app = express();

const socketio = require('socket.io'); // 추가

/** client html source 연결  [TK Yoon 2018. 11. 3. 오전 7:34:20] */
app.use(express.static(__dirname + '/views'));

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
const loginController = require('./controllers/login-controller');
app.use('/', loginController);

/** 글감 post controller 연결  [TK Yoon 2018. 10. 18. 오전 4:31:46] */
const postController = require('./controllers/post-controller');
app.use('/posts', postController);

/** 필사 transcribe controller 연결  [TK Yoon 2018. 10. 27. 오전 1:48:18] */
const transcribeController = require('./controllers/transcribe-controller');
app.use('/transcribes', transcribeController);

//var ip 		= require("ip");
const publicIp = require('public-ip');
var port 	= process.env.PORT || 8600;

const server = app.listen(port, function() {
	publicIp.v4().then(ip => {
    	log.info('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§');
    	log.info('Largo[Transcribe] Project Sever Started');
    	log.info('Sever IP	: %s', ip);
    	log.info('Sever Port	: %s', port);
    	log.info('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§');
    });
});

//log.info('Sever IP	: %o', server.address());

//test page
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

/** socket 연결  [TK Yoon 2018. 10. 30. 오전 4:24:30] */
const io = socketio(server); // socket.io와 서버 연결
var userCnt = 0;
io.sockets.on('connection', function (socket) {
	userCnt++;
	log.info('Connected User %s %s', userCnt, socket.id);
	
	socket.send('Sent a message after connection! ' + socket.id);

	//모든사용자에게 같은 메시지를 보낼경우
	io.sockets.emit('broadcast', userCnt + ' clients connected!');
	
	//자신에게는 emit 호출, 다른 사용자에게는 broadcast.emit 호출
	//socket.emit('newclientconnect', 'Hey, welcome!');
	//socket.broadcast.emit('newclientconnect', userCnt + ' clients connected!');
	
	socket.on('in', function (data) {
		log.info(data);
		
	});
	
	socket.on('out', function (data) {
		log.info(data);
		
	});
	
	socket.on('disconnect', function () {
		userCnt--;
	    log.info('Disconnected User %s', userCnt);
	    io.sockets.emit('broadcast', userCnt + ' clients connected!');
	});
	
});


//const socket = require('./socket');
//socket(io); // 아까 만든 이벤트 연결

