'use strict';

import MoveAction = require('./MoveAction');
import Unit = require('../Unit');
import MapMask = require('../../lib/MapMask');
import Game = require('../Game');
import GameMap = require('../GameMap');
import TileType = require('../TileType');

//let map1Data = require('../../../test_data/map1.json');
let mapGrassData = require('../../../test_data/map_grass.json');
let tileTypesData = require('../../../test_data/tile_types.json');

describe('UnitActions.Move', function () {
    let testee: MoveAction;
    let game, map, unit, mask;


    beforeAll(function (done) {
        // create simple mock tile data.
        TileType.load(tileTypesData)
            .then(done);
    });

    beforeEach(function () {
        testee = new MoveAction({ range: 6, terrainCosts: { grass: 1 } });
        map = new GameMap({ height: 6, width: 7 });
        map.createMapTiles(mapGrassData.tile_data);
        game = new Game({map: map});
        unit = new Unit({x: 3, y: 4, team: 'green'});
        mask = new MapMask(6, 7);
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

        /* Array Space to Hexes.
         *  __    __    __    __
         * /  \__/  \__/  \__/  \
         * \__/Z \__/  \__/  \__/
         * /Z \__/Z \__/Z \__/  \
         * \__/E \__/Z \__/Z \__/
         * /Z*\__/Z*\__/E \__/  \
         * \__/Z*\__/Z*\__/Z*\__/
         * /  \__/U \__/Z*\__/  \
         * \__/  \__/  \__/  \__/
         * /  \__/  \__/  \__/  \
         * \__/  \__/  \__/  \__/
         *
         */
        it('masks ZOC correctly', function () {
            unit = new Unit({x: 2, y: 4, team: 'green'});
            game.units.push(new Unit({x: 2, y: 1, team: 'red'}));
            game.units.push(new Unit({x: 4, y: 3, team: 'red'}));
            testee.updateMask(game, unit, mask);
            expect(mask.getTile(0, 2)).toEqual(MapMask.MaskType.MASK_CLEAR, '0,2');
            expect(mask.getTile(1, 3)).toEqual(MapMask.MaskType.MASK_CLEAR, '1,3');
            expect(mask.getTile(2, 2)).toEqual(MapMask.MaskType.MASK_CLEAR, '2,2');
            expect(mask.getTile(3, 2)).toEqual(MapMask.MaskType.MASK_CLEAR, '3,2');
            expect(mask.getTile(4, 3)).toEqual(MapMask.MaskType.MASK_CLEAR, '4,3');
            expect(mask.getTile(5, 2)).toEqual(MapMask.MaskType.MASK_CLEAR, '5,2');

            expect(mask.getTile(0, 1)).toEqual(MapMask.MaskType.MASK_BLACK, '0,1');
            expect(mask.getTile(1, 0)).toEqual(MapMask.MaskType.MASK_BLACK, '1,0');
            expect(mask.getTile(2, 1)).toEqual(MapMask.MaskType.MASK_BLACK, '2,1');
            expect(mask.getTile(3, 1)).toEqual(MapMask.MaskType.MASK_BLACK, '3,1');
            expect(mask.getTile(4, 1)).toEqual(MapMask.MaskType.MASK_BLACK, '4,1');
            expect(mask.getTile(5, 1)).toEqual(MapMask.MaskType.MASK_BLACK, '5,1');

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
