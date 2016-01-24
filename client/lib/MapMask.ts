'use strict';

import Hex = require('./Hex');
import Array2d = require('./Array2d');
import Renderable = require('../renderer/Renderable');


let availableTiles = {
    0: new Renderable({
        maskType: 0,
    }),
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
    /**
     * @property tiles
     * @type Array2d
     */
    private tiles: Array2d;

    private height: number;
    private width: number;
    private fillType: MapMask.MaskType;

    /**
     * Constructs the Map.
     * @constructor
     */
    constructor (height: number, width: number, fillType: MapMask.MaskType) {
        this.height = height;
        this.width = width;
        this.fillType = fillType || 0;
        this.tiles = new Array2d(this.height, this.width, this._getTile(this.fillType));
    }

    /**
     * Set a tile at a particular position.
     * @param {Number} x Position coordinate.
     * @param {Number} y Position coordinate.
     * @param {Number} value Index of tile to set with.
     */
    public setTile (x: number, y: number, value: MapMask.MaskType): void {
        this.tiles.set(x, y, this._getTile(value));
    }

    /**
     * Fills the mask with a particular tile.
     * @param {Number} value Tile index to fill with.
     */
    public fill (value: MapMask.MaskType): void {
        this.tiles.fill(this._getTile(value));
    }

    /**
     * Loop through each of the tiles.
     * @param {Function} callback Iterator function.
     */
    public each (callback: Function): void {
        this.tiles.each(callback);
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
        MASK_RED_OUTLINE
    }
}

export = MapMask;

