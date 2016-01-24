import TileType = require('./TileType');
'use strict';

import GameMap = require('./GameMap');

describe('Game', function () {
    let testee;
    beforeEach(function () {
        testee = new GameMap({});

        // create simple mock tile data.
        let tileData = new Map<string, TileType>();
        tileData.set('only', new TileType({}));
        TileType.load(tileData);


    });
    describe('getAllowedActions', function () {

    });
});
