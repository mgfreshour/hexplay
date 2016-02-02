import ShopAction = require('./ShopAction');
import MapMask = require('../../lib/MapMask');
import Game = require('../Game');
import GameMap = require('../GameMap');
import UnitType = require('../UnitType');
'use strict';

describe('ShopAction', function () {
    let testee: ShopAction, game: Game, map: GameMap;

    beforeAll(function (done) {
        let data = [{ name: 'testType', actions: { move: { range: 4 } } }];
        UnitType.load(data)
            .then(done);
    });

    beforeEach(function () {
        testee = new ShopAction({});
        map = new GameMap({ height: 6, width: 7 });
        game = new Game({map: map});
    });

    describe('getOptions', function () {
        it('returns list of available units');
    });

    describe('perform', function () {
        it('creates unit from options');
        it('charges game for unit');
        it('throws an error if options contains unavailable unit');
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
