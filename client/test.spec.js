'use strict';
var testee = require('./test.js');

describe('hello world', function () {
    it('should do stuff', function () {
        expect(testee).toBeDefined();
        expect(testee.one).toEqual(1);
    });
});