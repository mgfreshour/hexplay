'use strict';

import DefendAction = require('./DefendAction');
import MapMask = require('../../lib/MapMask');
import Game = require('../Game');
import GameMap = require('../GameMap');
import TileType = require('../TileType');
import UnitType = require('../UnitType');

//let map1Data = require('../../../test_data/map1.json');
let mapGrassData = require('../../../test_data/map_grass.json');
let tileTypesData = require('../../../test_data/tile_types.json');

describe('DefendAction', function () {
    let testee: DefendAction;
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
        testee = new DefendAction({ range: 4, terrainCosts: { grass: 1 } });
        map = new GameMap({ height: 6, width: 7 });
        map.createMapTiles(mapGrassData.tile_data);
        game = new Game({map: map});
        unit = game.createUnit({ x: 2, y: 3, type: 'testType', team: 'green'});
        mask = new MapMask(6, 7);
    });


    describe('getOptions', function () {
        it('returns nothing', function () {
            expect(testee.getOptions(game, unit)).toEqual([]);
        });
    });

    describe('updateMask', function () {
        it('returns mask untouched', function () {
            expect(testee.updateMask(game, unit, mask)).toEqual(mask);
        });
    });

    describe('canPerform', function () {
        it('always returns false', function () {
            expect(testee.canPerform(game, unit)).toEqual(false);
        });
    });

    describe('perform', function () {
        it('.... umm... I don`t know...');
    });
});
