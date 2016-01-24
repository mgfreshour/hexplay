import Array2d = require('../lib/Array2d');
import Unit = require('./Unit');
import Tile = require('./Tile');
'use strict';

/**
 * @class Map
 * @constructor
 * @type {*}
 */
class GameMap {
    public height: number;
    public width: number;
    private name: string;
    private availableTeams: [string];
    private tileData: Array2d<any>;
    private unitData: [any];
    private tiles: Array2d<Tile>;


    constructor (options) {
        this.height = options.height;
        this.width = options.width;
        this.name = options.name;
        this.availableTeams = options.availableTeams;
        this.tileData = options.tileData;
        this.unitData = options.unitData;
        this.tiles = options.tiles;
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} typeIndex
     * @param {String} team
     * @return {Object} the unit data added
     */
    public addUnitData (x, y, typeIndex, team) {
        let data = {
            x: x,
            y: y,
            type_index: typeIndex,
            team: team,
        };
        this.unitData.push(data);
        return data;
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     */
    public removeUnitDataAt (x, y) {
        let n, data;
        for (n = 0; n < this.unitData.length; n++) {
            data = this.unitData[n];
            if (data.x === x && data.y === y) {
                return this.unitData.splice(n, 1)[0];
            }
        }
    }


    /**
     *
     * @param {Number} x
     * @param {Number} y
     */
    public getUnit (x, y) {
        let n, data;
        for (n = 0; n < this.unitData.length; n++) {
            data = this.unitData[n];
            if (data.x === x && data.y === y) {
                return data;
            }
        }
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     */
    public getTile (x, y) {
        return this.tiles.get(x, y);
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Tile} tile
     */
    public setTile (x, y, tile) {
        this.tiles.set(x, y, tile);
    }

    /**
     * @method creatMapTiles
     * Creates the internal representation of tiles in the map
     */
    public createMapTiles () {
        let tileData = this.tileData,
            height = this.height,
            width = this.width;

        this.tiles = new Array2d<Tile>(height, width);
        this.tiles.on('change', _.bind( function (x, y, tile, old) {
            this.trigger('tileChange', x, y, tile, old);
        }, this) );

        for (let y  = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let tile = Tile.createTileForTypeIndex(tileData[y][x].type_index);
                this.setTile(x, y, tile);
            }
        }
    }

    /**
     * @method forEachTile
     * @param {Function} callback function(tile, x, y)
     */
    public forEachTile (callback) {
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

    /**
     *
     * @private
     */
    private _updateTeams () {
        //this.team_blue = false;
        //this.team_green = false;
        //this.team_red = false;
        //this.team_white = false;
        //let teams = this.availableTeams, n;
        //for (n = 0; n < teams.length; n++) {
        //    this.set('team_' + teams[n], true);
        //}
    }
}

export = GameMap;
