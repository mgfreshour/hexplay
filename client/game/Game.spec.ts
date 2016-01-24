import TileType = require('./TileType');
'use strict';

import Game = require('./Game');

describe('Game', function () {
    let testee;
    beforeEach(function () {
        testee = new Game({});

        // create simple mock tile data.
        let tileData = new Map<string, TileType>();
        tileData.set('only', new TileType({}));
        TileType.load(tileData);


    });
    describe('getAllowedActions', function () {

    });
});
