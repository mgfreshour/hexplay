'use strict';

import Hex = require('./Hex');
import Array2d = require('./Array2d');
import Renderable = require('../renderer/Renderable');


let availableTiles = {
    0: new Renderable({ maskType: 0 }),
    1: new Renderable({
        maskType: 1,
        img: { src: '/images/misc/mask.png', height: Hex.HEX_HEIGHT, width: Hex.HEX_WIDTH },
    }),
    2: new Renderable({
        maskType: 2,
        img: { src: '/images/misc/mask-red.png', height: Hex.HEX_HEIGHT, width: Hex.HEX_WIDTH },
    }),
};


/**
 * Represents a transparent mask displayed over the map.
 * @class MapMask
 * @type {*}
 */
class MapMask {
    private tiles: Array2d<MapMask.MaskType>;

    private _height: number;
    private _width: number;
    private fillType: MapMask.MaskType;

    get height () { return this._height; }
    get width () { return this._width; }

    /**
     * Constructs the GameMap.
     * @constructor
     * @param {number} height Dimension of map.
     * @param {number} width Dimension of map.
     * @param {MapMask.MaskType} fillType Type to initially fill map with.
     */
    constructor (height: number, width: number, fillType: MapMask.MaskType = MapMask.MaskType.MASK_CLEAR) {
        this._height = height;
        this._width = width;
        this.fillType = fillType;
        this.tiles = new Array2d(this._height, this._width, this.fillType);
    }

    /**
     * Set a tile at a particular position.
     * @param {Number} x Position coordinate.
     * @param {Number} y Position coordinate.
     * @param {Number} value Index of tile to set with.
     */
    public setTile (x: number, y: number, value: MapMask.MaskType): void {
        this.tiles.set(x, y, value);
    }

    /**
     * Gets the tile at a position.
     * @param {Number} x Position coordinate.
     * @param {Number} y Position coordinate.
     * @returns {MapMask.MaskType} The type of tile.
     */
    public getTile (x: number, y: number): MapMask.MaskType {
        return this.tiles.get(x, y);
    }

    /**
     * Fills the mask with a particular tile.
     * @param {Number} value Tile index to fill with.
     */
    public fill (value: MapMask.MaskType): void {
        this.tiles.fill(value);
    }

    /**
     * Loop through each of the tiles.
     * @param {Function} callback Iterator function.
     */
    public each (callback: (x: number, y: number, item: MapMask.MaskType) => void): void {
        this.tiles.each(callback);
    }

    /**
     * Gets a renderable version of the mask.
     * @returns {Array2d<Renderable>} Array of renderable items.
     */
    public renderable () {
        let _this = this;
        return this.tiles.map((x, y, item) => _this._getTile(item));
    }

    /**
     * Get an actual tile based on an index.
     * @param {Number} index Index to use.
     * @returns {*} Instance of the tile.
     * @private
     */
    private _getTile (index: number): Renderable {
        if (!availableTiles[index]) {
            throw 'Invalid value to fill mask with - ' + index;
        }
        return availableTiles[index];
    }

}


module MapMask {
    'use strict';
    export enum MaskType {
        MASK_CLEAR,
        MASK_BLACK,
        MASK_RED_OUTLINE,
    }
}

export = MapMask;

