/**
 * 
 */
var log 		= require('./util/logger');
var socketio 	= require('socket.io');

io = socketio.listen(server);

module.exports.io = io.sockets.on('connection', function (socket) {
	log.info(socket);
	
	socket.on('in', function (data) {
		log.info(data);
		
	});
	
	socket.on('out', function (data) {
		log.info(data);
		
	});
	
});

//module.exports = (io) => {
//	  io.on('connection', (socket) => { // 웹소켓 연결 시
//	    console.log('Socket initiated!');
//	    socket.on('newScoreToServer', (data) => { // 클라이언트에서 newScoreToServer 이벤트 요청 시
//	      console.log('Socket: newScore');
//	      io.emit('newScoreToClient', data);
//	    });
//	  });
//	};