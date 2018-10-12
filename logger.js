/** logger  [TK Yoon 2018. 10. 13. 오전 9:17:41] */
 

var fs 		= require('fs');
var moment 	= require('moment');


var log = require('tracer').colorConsole({
	transport: [
		function (data) {
			fs.appendFile('./log/pilsa.'+ moment(data.timestame).format('YYYY-MM-DD') +'.log', data.rawoutput + '\n', (err) => {
				if (err) throw err;
			});
		}
		, function(data) {
			console.log(data.output);
		}
	]
	, format : [
		//"{{timestamp}} <{{title}}>:{{message}} (in {{file}}:{{line}})" //default format
		"[{{timestamp}}] [{{title}} {{path}}:{{line}}] - {{message}}"
		, {
			error : "[{{timestamp}}] [{{title}} {{path}}:{{line}}] - {{message}}\nCall Stack:\n{{stack}}" // error format
		}
	]
	, dateformat : "yy-mm-dd HH:MM:ss.l"
	, preprocess :  function(data){
		data.title = data.title.toUpperCase();
	}
});

module.exports = log;

/** 예제 샘플  [TK Yoon 2018. 10. 13. 오전 9:18:20] */
//log.log('hello');
//log.trace('hello', 'world');
//log.debug('hello %s', 'world', 123);
//log.info('hello %s %d', 'world', 123, {foo: 'bar'});
//log.warn('hello %s %d %j', 'world', 123, {foo: 'bar'});
//log.error('hello %s %d %j', 'world', 123, {foo: 'bar'}, [1, 2, 3, 4], Object);