import Array2d = require('../lib/Array2d');
import Tile = require('./Tile');
'use strict';

/**
 * Represents the map the game is played on.
 * @class GameMap
 */
class GameMap {
    public height: number;
    public width: number;
    private name: string;
    private availableTeams: [string];
    private tiles: Array2d<Tile>;

    /**
     * Constructor.
     * @constructor.
     * @param {Object} options
     */
    constructor (options: any) {
        this.height = options.height;
        this.width = options.width;
        this.name = options.name;
        this.availableTeams = options.availableTeams;
        this.tiles = options.tiles;
    }

    /**
     * Gets the tile object at position.
     * @param {Number} x Coordinate.
     * @param {Number} y Coordinate.
     * @returns {Tile} Tile object.
     */
    public getTile (x: number, y: number): Tile {
        return this.tiles.get(x, y);
    }

    /**
     * Sets the tile object at position.
     * @param {Number} x Coordinate.
     * @param {Number} y Coordinate.
     * @param {Tile} tile Object to set.
     */
    public setTile (x: number, y: number, tile: Tile) {
        this.tiles.set(x, y, tile);
    }

    /**
     * Creates the internal representation of tiles in the map.
     * @param {Array<Array<any>>} tileData Data from server.
     */
    public createMapTiles (tileData: Array<Array<any>>) {
        let height = this.height,
            width = this.width;

        this.tiles = new Array2d<Tile>(height, width);

        for (let y  = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let tile = Tile.createTileForTypeIndex(tileData[y][x].type);
                this.setTile(x, y, tile);
            }
        }
    }

    /**
     * Loops through the tiles.
     * @param {Function} callback function(tile, x, y)
     */
    public forEachTile (callback: (tile: Tile, x: number, y: number) => void) {
        let height = this.height,
            width = this.width,
            tile;

        for (let y  = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tile = this.getTile(x, y);
                callback(tile, x, y);
            }
        }
    }
}

export = GameMap;
