import GameFactory = require('../GameFactory');
import MoveAction = require('./MoveAction');
import MapMask = require('../../lib/MapMask');
'use strict';

describe('UnitActions.Move', function () {
    let testee: MoveAction;
    let game, map, unit, mask;


    beforeEach(function () {
        return GameFactory.newTestGame('map_grass').then(function (newGame) {
            map = newGame.map;
            game = newGame;
            mask = new MapMask(map.height, map.width);
            testee = new MoveAction({ range: 4, terrainCosts: { grass: 1 } });
            unit = game.createUnit({ x: 2, y: 3, type: 'undead thrall', team: 'green'});
        });
    });

    describe('canPerform', function () {
        it('returns true for unmoved unit', function () {
            expect(testee.canPerform(game, unit)).toEqual(true);
        });
    });

    describe('getOptions', function () {
        it('returns nothing', function () {
            expect(testee.getOptions(game, unit)).toEqual([]);
        });
    });

    describe('updateMask', function () {
        it('masks occupied hex black', function () {
            game.createUnit({ x: 4, y: 4, type: 'undead thrall', team: 'green'});
            testee.updateMask(game, unit, mask);
            expect(mask.getTile(4, 4)).toEqual(MapMask.MaskType.MASK_BLACK);
        });

        it('masks empty hex clear', function () {
            testee.updateMask(game, unit, mask);
            expect(mask.getTile(4, 4)).toEqual(MapMask.MaskType.MASK_CLEAR);
        });

        /* Array Space to Hexes.
         *    _____         _____         _____         _____
         *   /     \       /     \       /     \       /     \
         *  /  0,0  \_____/  2,0  \_____/  4,0  \_____/  6,0  \
         *  \       /     \  zoc  /     \       /     \       /
         *   \_____/  1,0  \_____/  3,0  \_____/  5,0  \_____/
         *   /     \  zoc  /     \  zoc  /     \       /     \
         *  /  0,1  \_____/  2,1  \_____/  4,1  \_____/  6,1  \
         *  \       /     \ unit  /     \       /     \       /
         *   \_____/  1,1  \_____/  3,1  \_____/  5,1  \_____/
         *   /     \  zoc  /     \  zoc  /     \       /     \
         *  /  0,2  \_____/  2,2  \_____/  4,2  \_____/  6,2  \
         *  \       /     \  zoc  /     \  zoc  /     \       /
         *   \_____/  1,2  \_____/  3,2  \_____/  5,2  \_____/
         *   /     \       /     \  zoc  /     \  zoc  /     \
         *  /  0,3  \_____/  2,3  \_____/  4,3  \_____/  6,3  \
         *  \       /     \ XXXXX /     \ unit  /     \       /
         *   \_____/  1,3  \_____/  3,3  \_____/  5,3  \_____/
         *   /     \       /     \  zoc  /     \  zoc  /     \
         *  /  0,4  \_____/  2,4  \_____/  4,4  \_____/  6,4  \
         *  \       /     \       /     \  zoc  /     \       /
         *   \_____/  1,4  \_____/  3,4  \_____/  5,4  \_____/
         *   /     \       /     \       /     \       /     \
         *  /  0,5  \_____/  2,5  \_____/  4,5  \_____/  6,5  \
         *  \       /     \       /     \       /     \       /
         *   \_____/  1,5  \_____/  3,5  \_____/  5,5  \_____/
         *         \       /     \       /     \       /
         *          \_____/       \_____/       \_____/
         *
         */
        it('masks ZOC correctly', function () {
            game.createUnit({ x: 2, y: 1, type: 'undead thrall', team: 'red'});
            game.createUnit({ x: 4, y: 3, type: 'undead thrall', team: 'red'});
            testee.updateMask(game, unit, mask);
            expect(mask.getTile(1, 0)).toEqual(MapMask.MaskType.MASK_CLEAR, '1, 0');
            expect(mask.getTile(1, 1)).toEqual(MapMask.MaskType.MASK_CLEAR, '1, 1');
            expect(mask.getTile(2, 2)).toEqual(MapMask.MaskType.MASK_CLEAR, '2, 2');
            expect(mask.getTile(3, 2)).toEqual(MapMask.MaskType.MASK_CLEAR, '3, 2');
            expect(mask.getTile(3, 3)).toEqual(MapMask.MaskType.MASK_CLEAR, '3, 3');
            expect(mask.getTile(4, 4)).toEqual(MapMask.MaskType.MASK_CLEAR, '4, 4');

            expect(mask.getTile(2, 0)).toEqual(MapMask.MaskType.MASK_BLACK, '2, 0');
            expect(mask.getTile(3, 1)).toEqual(MapMask.MaskType.MASK_BLACK, '3, 1');
            expect(mask.getTile(3, 0)).toEqual(MapMask.MaskType.MASK_BLACK, '3, 0');
            expect(mask.getTile(4, 2)).toEqual(MapMask.MaskType.MASK_BLACK, '4, 2');
            expect(mask.getTile(5, 2)).toEqual(MapMask.MaskType.MASK_BLACK, '5, 2');

        });
    });

    describe('perform', function () {
        it('moves unit to new coordinates', function () {
            let x = 0, y = 0;
            while (x++ < 6) {
                while (y++ < 5) {
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
            game.createUnit({ x: 4, y: 4, type: 'undead thrall', team: 'red'});
            testee.perform(game, unit, 4, 4);
            expect(unit.x).toEqual(x);
            expect(unit.y).toEqual(y);
        });

        it('returns false when ordered to move to occupied hex', function () {
            game.createUnit({ x: 4, y: 4, type: 'undead thrall', team: 'red'});
            let ret = testee.perform(game, unit, 4, 4);
            expect(ret).toEqual(false);
        });

        it('marks action as cannot be performed after', function () {
            expect(testee.canPerform(game, unit)).toBeTruthy();
            testee.perform(game, unit, 4, 4);
            expect(testee.canPerform(game, unit)).toBeFalsy();
        });
    });
});
