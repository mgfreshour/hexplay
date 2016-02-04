import ShopAction = require('./ShopAction');
import MapMask = require('../../lib/MapMask');
import Game = require('../Game');
import GameMap = require('../GameMap');
import UnitType = require('../UnitType');
import Unit = require('../Unit');
'use strict';

describe('ShopAction', function () {
    let testee: ShopAction,
        game: Game,
        map: GameMap,
        options: any;

    beforeAll(function (done) {
        let data = [{ name: 'testType', actions: { move: { range: 4 } } }];
        UnitType.load(data)
            .then(done);
    });

    beforeEach(function () {
        options = {
            testType: { cost: 100 },
            testType2: { cost: 200 },
        };
        testee = new ShopAction({ types: options });
        map = new GameMap({ height: 6, width: 7 });
        game = new Game({map: map});
    });

    describe('getOptions', function () {
        it('returns list of available units', function () {
            expect(testee.getOptions(game, 3, 4)).toEqual(options);
        });
    });

    describe('perform', function () {
        it('charges player for unit');
        it('creates unit from options', function () {
            testee.perform(game, 2, 1, { type: 'testType', team: 'red' });
            expect(game.getUnit(2, 1)).toEqual(jasmine.any(Unit));
        });
        it('throws an error if team is not specified', function () {
            expect(function () {
                testee.perform(game, 2, 1, { type: 'testType' });
            }).toThrow();
        });
        it('throws an error if type is not specified', function () {
            expect(function () {
                testee.perform(game, 2, 1, { team: 'red' });
            }).toThrow();
        });
        it('throws an error if unit is on the hex', function () {
            game.createUnit({ x: 2, y: 1, type: 'testType', team: 'red'});
            expect(function () {
                testee.perform(game, 2, 1, { type: 'testType', team: 'red' });
            }).toThrow();
        });
        it('throws an error if options contains unavailable unit', function () {
            expect(function () {
                testee.perform(game, 2, 1, { type: 'testType3', team: 'red' });
            }).toThrow();
        });
    });
    describe('canPerform', function () {
        it('can perform if no unit on hex', function () {
            expect(testee.canPerform(game, 3, 4)).toEqual(true);
        });
        it('cannot perform if unit on hex', function () {
            game.createUnit({ x: 2, y: 1, type: 'testType', team: 'red'});
            expect(testee.canPerform(game, 2, 1)).toEqual(false);
        });
    });
    describe('updateMask', function () {
        it('returns passsed mask', function () {
            let mask = new MapMask(4, 4);
            expect(testee.updateMask(game, 2, 3, mask)).toEqual(mask);
        });
    });
});
