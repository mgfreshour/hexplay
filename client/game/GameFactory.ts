import TileType = require('./TileType');
import Game = require('./Game');
import UnitType = require('./UnitType');
import GameMap = require('./GameMap');
import Hex = require('../lib/Hex');
import Promise = require('bluebird');
'use strict';

class GameFactory {
    /**
     * Creates a default game suitable for testing.
     * @returns {Promise} resolves with the created game object.
     */
    public static newTestGame (mapName?: string): Promise<Game> {
        mapName = mapName || 'map1';
        let map1Data = require(`../../test_data/${mapName}.json`),
            tileTypesData = require('../../test_data/tile_types.json'),
            unitTypeData = require('../../test_data/unit_types.json');

        return UnitType.load(unitTypeData)
            .then(function () {
                return TileType.load(tileTypesData);
            })
            .then(function () {
                let map = new GameMap({
                    height: 6,
                    width: 7,
                });
                map.createMapTiles(map1Data.tile_data);
                //console.log(Hex.asciiHexmap(map.map((x, y, tile) => tile.type.name)));
                return new Game({map: map});
            });
    }

    public static newGame (): Promise<Game> {
        return new Promise<Game>(function (resolve, reject) {
            resolve(undefined);
        });
    }

    public static loadGame (): Promise<Game> {
        return new Promise<Game>(function (resolve, reject) {
            resolve(undefined);
        });
    }
}

export = GameFactory;
