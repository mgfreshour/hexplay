'use strict';

var glob = require('glob');

module.exports = function (server) {
    glob('**/*.js', {
        cwd: __dirname,
        ignore: ['**/*.spec.js', '**/index.js'],
    }, function (err, files) {
        files.forEach(function (file) {
            require('./' + file.replace('.js', ''))(server);
        });
    });
};
