'use strict';

import TileType = require('./TileType');
import GameMap = require('./GameMap');
let map1Data = require('../../test_data/map1.json');
let tileTypesData = require('../../test_data/tile_types.json');

describe('GameMap', function () {
    let testee: GameMap, map1;

    let loadMap = function () {
        map1 = _.clone(map1Data);
        testee.createMapTiles(map1.tile_data);
    };
    beforeEach(function (done) {
        // create simple mock tile data.
        TileType.load(tileTypesData)
            .then(function () {
                testee = new GameMap({
                    height: 6,
                    width: 7,
                });
                done();
            });
    });
    it('createMapTiles works', function () {
        loadMap();
        expect(testee.getTile(0, 0).type.name).toEqual('forest');
        expect(testee.getTile(6, 0).type.name).toEqual('castle');
    });
    describe('getAllowedActions', function () {

    });
});
