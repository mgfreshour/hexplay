'use strict';

import MoveAction = require('./MoveAction');
import Unit = require('../Unit');
import MapMask = require('../../lib/MapMask');
import Game = require('../Game');
import GameMap = require('../GameMap');

describe('UnitActions.Move', function () {
    let testee: MoveAction;
    let game, map, unit, mask;

    beforeEach(function () {
        testee = new MoveAction();
        map  = new GameMap({height: 10, width: 10});
        game = new Game({map: map});
        unit = new Unit({x: 2, y: 3, team: 'green'});
        mask = new MapMask(10, 10);
    });

    describe('#updateMask', function () {
        it('masks occupied hex black', function () {
            game.units.push(new Unit({x: 4, y: 4, team: 'green'}));
            testee.updateMask(game, unit, mask);
            expect(mask.getTile(4, 4)).toEqual(MapMask.MaskType.MASK_BLACK);
        });

        it('masks empty hex clear', function () {
            testee.updateMask(game, unit, mask);
            expect(mask.getTile(4, 4)).toEqual(MapMask.MaskType.MASK_CLEAR);
        });
    });

    describe('#perform', function () {
        it('moves unit to new coordinates', function () {
            let x = 0, y = 0;
            while (x++ < 6) {
                while (y++ < 6) {
                    testee.perform(game, unit, x, y);
                    expect(unit.x).toEqual(x);
                    expect(unit.y).toEqual(y);
                }
            }
        });

        it('returns true when unit moved to empty hex', function () {
            let ret = testee.perform(game, unit, 4, 4);
            expect(unit.x).toEqual(4);
            expect(unit.y).toEqual(4);
            expect(ret).toEqual(true);
        });

        it('does not move unit to occupied hex', function () {
            let x = unit.x, y = unit.y;
            game.units.push(new Unit({x: 4, y: 4}));
            testee.perform(game, unit, 4, 4);
            expect(unit.x).toEqual(x);
            expect(unit.y).toEqual(y);
        });

        it('returns false when ordered to move to occupied hex', function () {
            game.units.push(new Unit({x: 4, y: 4}));
            let ret = testee.perform(game, unit, 4, 4);
            expect(ret).toEqual(false);
        });
    });
});
