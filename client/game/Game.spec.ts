'use strict';

import GameMap = require('./GameMap');
import TileType = require('./TileType');
import Game = require('./Game');
import UnitType = require('./UnitType');
import Unit = require('./Unit');
let map1Data = require('../../test_data/map1.json');
let tileTypesData = require('../../test_data/tile_types.json');

describe('Game', function () {
    let testee, map;


    beforeAll(function (done) {
        let data = [{ name: 'testType', actions: { move: { range: 4 } } }];
        UnitType.load(data)
            .then(done);
    });

    beforeEach(function (done) {
        // create simple mock tile data.
        TileType.load(tileTypesData)
            .then(function () {
                map = new GameMap({
                    height: 6,
                    width: 7,
                });
                map.createMapTiles(map1Data.tile_data);
                done();
            });
    });

    beforeEach(function () {
        testee = new Game({ map: map });
    });

    describe('createUnit', function () {
        it('adds the requested unit', function () {
            let unit = testee.createUnit({ x: 3, y: 4, type: 'testType', team: 'green'});
            expect(unit).toEqual(jasmine.any(Unit));
            expect(testee.units.length).toEqual(1);
        });
        it('throws an error if unit is outside of map', function () {
            let x = testee.map.width + 1;
            expect(() => testee.createUnit({ x: x, y: 4, type: 'testType', team: 'green'}))
                .toThrow();
        });
    });
    it('should not die horrible', function () {

    });
});
