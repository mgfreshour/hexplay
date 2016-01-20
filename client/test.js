'use strict';

var fn = require('./test2.js'),
    Promise = require('bluebird');

fn('Now!');

module.exports.one = 1;
throw new Error('test');
