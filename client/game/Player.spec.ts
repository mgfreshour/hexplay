import Player = require('./Player');
'use strict';

describe('Player', function () {
    let testee;

    describe('constructor', function () {
        it('sets the team', function () {
            testee = new Player({ team: 'red' });
            expect(testee.team).toEqual('red');
        });
        it('throws if no team provided', function () {
            expect(() => testee = new Player({})).toThrow();
        });
    });
});
