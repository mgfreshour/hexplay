'use strict';
module.exports = function(server) {

    // Sample route
    server.get('/test', function (req, res, next) {
        res.send({ 'result': 'test' });
        return next();
    });


    server.get('/echo/:name', function (req, res, next) {
        res.send(req.params);
        return next();
    });


};