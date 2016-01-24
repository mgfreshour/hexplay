#!/usr/bin/env node
'use strict';

let restify = require('restify');
let bunyan  = require('bunyan');
let path    = require('path');

let server = restify.createServer({
  name: 'myapp',
  version: '1.0.0',
    log: bunyan.createLogger({
        name        : 'myapp',
        level       : process.env.LOG_LEVEL || 'info',
        stream      : process.stdout,
        serializers : bunyan.stdSerializers,
    }),
});

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.gzipResponse());
server.pre(restify.pre.sanitizePath());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get(/\/public\/?.*/, restify.serveStatic({
  directory: path.join(__dirname, '..', '..')
}));

server.get('/', restify.serveStatic({
  directory: path.join(__dirname, '..', '..', 'public'),
  file: 'index.html',
}));

require('../routes')(server);

server.on('uncaughtException', (req: any, res: any, err: Error) => {
    console.error(err);
    res.send(500, { success : false });
});

//server.on('after', restify.auditLogger({
//    log: bunyan.createLogger({
//        name: 'audit',
//        stream: process.stdout
//    })
//}));


server.listen(8080, () => console.log('%s listening at %s', server.name, server.url));
