'use strict';

import MoveAction = require('./MoveAction');
import MapMask = require('../../lib/MapMask');
import Game = require('../Game');
import GameMap = require('../GameMap');
import TileType = require('../TileType');
import UnitType = require('../UnitType');

//let map1Data = require('../../../test_data/map1.json');
let mapGrassData = require('../../../test_data/map_grass.json');
let tileTypesData = require('../../../test_data/tile_types.json');

describe('UnitActions.Move', function () {
    let testee: MoveAction;
    let game, map, unit, mask;

    beforeAll(function (done) {
        let data = [{ name: 'testType', actions: { move: { range: 4 } } }];
        UnitType.load(data)
            .then(done);
    });
    beforeAll(function (done) {
        // create simple mock tile data.
        TileType.load(tileTypesData)
            .then(done);
    });

    beforeEach(function () {
        testee = new MoveAction({ range: 4, terrainCosts: { grass: 1 } });
        map = new GameMap({ height: 6, width: 7 });
        map.createMapTiles(mapGrassData.tile_data);
        game = new Game({map: map});
        unit = game.createUnit({ x: 2, y: 3, type: 'testType', team: 'green'});
        mask = new MapMask(6, 7);
    });

    describe('#updateMask', function () {
        it('masks occupied hex black', function () {
            game.createUnit({ x: 4, y: 4, type: 'testType', team: 'green'});
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
            game.createUnit({ x: 2, y: 1, type: 'testType', team: 'red'});
            game.createUnit({ x: 4, y: 3, type: 'testType', team: 'red'});
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

    describe('#perform', function () {
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
            game.createUnit({ x: 4, y: 4, type: 'testType', team: 'red'});
            testee.perform(game, unit, 4, 4);
            expect(unit.x).toEqual(x);
            expect(unit.y).toEqual(y);
        });

        it('returns false when ordered to move to occupied hex', function () {
            game.createUnit({ x: 4, y: 4, type: 'testType', team: 'red'});
            let ret = testee.perform(game, unit, 4, 4);
            expect(ret).toEqual(false);
        });
    });
});
