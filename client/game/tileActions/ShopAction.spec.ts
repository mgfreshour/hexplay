import ShopAction = require('./ShopAction');
import MapMask = require('../../lib/MapMask');
import GameFactory = require('../GameFactory');
'use strict';

describe('ShopAction', function () {
    let testee: ShopAction, game, map, options;

    beforeEach(function () {
        return GameFactory.newTestGame().then(function (newGame) {
            map = newGame.map;
            game = newGame;
            options = {
                'human peasant': { cost: 100 },
                'undead thrall': { cost: 200 },
            };
            testee = new ShopAction({ types: options });
        });
    });

    describe('getOptions', function () {
        it('returns list of available units', function () {
            expect(testee.getOptions(game, 6, 0)).toEqual(options);
        });
    });

    describe('perform', function () {
        it('charges player for unit');
        it('creates unit from options', function () {
            testee.perform(game, 6, 0, { type: 'human peasant', team: 'red' });
            expect(game.getUnit(6, 0).type.name).toEqual('human peasant');
        });
        it('throws an error if team is not specified', function () {
            expect(function () {
                testee.perform(game, 6, 0, { type: 'human peasant' });
            }).toThrow();
        });
        it('throws an error if type is not specified', function () {
            expect(function () {
                testee.perform(game, 6, 0, { team: 'red' });
            }).toThrow();
        });
        it('throws an error if unit is on the hex', function () {
            game.createUnit({ x: 6, y: 0, type: 'human peasant', team: 'red'});
            expect(function () {
                testee.perform(game, 6, 0, { type: 'human peasant', team: 'red' });
            }).toThrow();
        });
        it('throws an error if options contains unavailable unit', function () {
            expect(function () {
                testee.perform(game, 6, 0, { type: 'non-existant type', team: 'red' });
            }).toThrow();
        });
    });
    describe('canPerform', function () {
        it('can perform if no unit on hex', function () {
            expect(testee.canPerform(game, 6, 1)).toEqual(true);
        });
        it('cannot perform if unit on hex', function () {
            game.createUnit({ x: 6, y: 0, type: 'human peasant', team: 'red'});
            expect(testee.canPerform(game, 6, 0)).toEqual(false);
        });
    });
    describe('updateMask', function () {
        it('returns passsed mask', function () {
            let mask = new MapMask(map.height, map.width);
            expect(testee.updateMask(game, 6, 0, mask)).toEqual(mask);
        });
    });
});
