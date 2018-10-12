///**
// * logger 설정
// */
var winston = require('winston');
var winstonDaily = require('winston-daily-rotate-file');
var moment = require('moment');
 
function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH24:mm:ss.SSS');                            
};

//logger 설정
//var logger = new (winston.Logger)({
var logger = winston.createLogger({
    transports: [
        new (winstonDaily)({
            name: 'info-file',
            //filename: './log/server',
           // datePattern: '_yyyy-MM-dd.log',
            filename: './log/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'debug',
            showLevel: true,
            json: false,
            prepend: true,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'debug-console',
            level: 'debug',
            depth:true,
//            timestamp: timeStampFormat,
//            json: false,
//            format : winston.format.combine(
//                    winston.format.timestamp(),
//                    winston.format.json()
//                )
            format: winston.format.combine(
        		winston.format.colorize(),
            	winston.format.splat(),
            	winston.format.simple(),
            	winston.format.timestamp({
            		format: 'YYYY-MM-DD HH:mm:ss.SSS'
            	})
            	, winston.format.printf(info => `[${info.timestamp}(${info.level}${info.depth)]:${info.message}`)
            )
        })
    ],
    exceptionHandlers: [
        new (winstonDaily)({
            name: 'exception-file',
//            filename: './log/exception',
//            datePattern: '_yyyy-MM-dd.log',
            filename: './log/excepetion-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'error',
            showLevel: true,
            json: false,
            prepend: true,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});
 
//logger를 통한 로그 출력
logger.log('info', 'test message %s, %s, %o', 'first', 'second', { number: 123 });
logger.info("infolevel 로깅 %s %s, %j", 'test', 123, {name : 123});
logger.debug("debuglevel1 로깅");
logger.error("debuglevel2 로깅");
logger.error("debuglevel3 로깅");



//  var winston = require('winston');
//  require('winston-daily-rotate-file');
//
//  var transport = new (winston.transports.DailyRotateFile)({
//    filename: 'application-%DATE%.log',
//    datePattern: 'YYYY-MM-DD-HH',
//    zippedArchive: true,
//    maxSize: '20m',
//    maxFiles: '14d'
//  });
//
//  transport.on('rotate', function(oldFilename, newFilename) {
//    // do something fun
//  });
//
////  var logger = new (winston.Logger)({
////    transports: [
////      transport
////    ]
////  });
//  
//  let logger = winston.createLogger({
//	  transports: [
//		  transport
//	  ],
//	  exitOnError: false, // do not exit on handled exceptions
//	});
//
//  logger.info('Hello World!');