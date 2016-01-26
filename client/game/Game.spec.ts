'use strict';

import GameMap = require('./GameMap');
import TileType = require('./TileType');
import Game = require('./Game');
let map1Data = require('../../test_data/map1.json');
let tileTypesData = require('../../test_data/tile_types.json');

describe('Game', function () {
    let testee, map;

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
    it('should not die horrible', function () {

    });
});
