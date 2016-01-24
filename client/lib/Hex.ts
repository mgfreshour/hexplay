'use strict';

require('es6-shim');
import Array2d = require('./Array2d');
import _ = require('lodash');
import IPoint = require('./IPoint');


/**
 * Class that contains functions for working with a hex map.
 * @class Hex
 */
class Hex {

    /**
     * The height of a hex in pixels
     * @const
     * @type {Number}
     */
    public static HEX_HEIGHT: number = 72;

    /**
     * The height of a hex in pixels
     * @const
     * @type {Number}
     */
    public static HEX_WIDTH: number = 72;

    /**
     * The length of one of the sides of a hex in pixels (all 6 sides should be equal).
     * @const
     * @type {Number}
     */
    public static HEX_SIDE: number = Hex.HEX_HEIGHT / 2;

    /**
     * Returns the X,Y coordinates of all valid adjacent hex.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} height The height of 2d array representing the hex map.
     * @param {Number} width The width of 2d array representing the hex.
     * @return {Array.<{x: number, y: number}>} array of {x, y} Objects representing adjacent coordinates.
     */
    public static getAdjacentCoords (x: number, y: number, height: number, width: number): Array<IPoint> {
        let possible: Array<IPoint> = undefined;
        if (x % 2) {
            possible = [
                //{x:x+1, y:y-1},
                {x: x + 1, y: y},
                {x: x + 1, y: y + 1},
                {x: x, y: y - 1},
                {x: x, y: y},
                {x: x, y: y + 1},
                //{x:x-1, y:y-1},
                {x: x - 1, y: y},
                {x: x - 1, y: y + 1},
            ];
        } else {
            possible = [
                {x: x + 1, y: y - 1},
                {x: x + 1, y: y},
                //{x:x+1, y:y+1},
                {x: x, y: y - 1},
                {x: x, y: y},
                {x: x, y: y + 1},
                {x: x - 1, y: y - 1},
                {x: x - 1, y: y},
                //{x:x-1, y:y+1}
            ];
        }
        let ret: Array<IPoint> = [];

        for (let n: number = 0; n < possible.length; n++) {
            if (possible[n].x >= 0 && possible[n].x < width && possible[n].y >= 0 && possible[n].y < height) {
                ret.push(possible[n]);
            }
        }

        return ret;
    }


    /**
     * Recursively walks a hex map starting from x,y and iterating through adjacent hex.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} maxDepth how far from the starting hex to walk.  Defaults to 1.
     * @param {Function} callback function to call with each step
     * @param {Number} height is the height of 2d bitmap representing the hex map
     * @param {Number} width is the height of 2d bitmap representing the hex map
     * @param {Number} [currentDepth] (used on recursion only!) how far we've recursed from original point
     * @param {Array2d} [bitmap] (used on recursion only!) contains info about which hex's we've visited
     * @param {Number|undefined} [prevX] coordinate of the hex we're recursing from
     * @param {Number|undefined} [prevY] coordinate of the hex we're recursing from
     */
    public static walkAdjacent (x: number, y: number, maxDepth: number, callback: Function, height: number, width: number,
                                currentDepth?: number, bitmap?: Array2d<number>, prevX?: number, prevY?: number): void {
        currentDepth = currentDepth || 1;
        maxDepth = maxDepth || 1;
        prevX = _.isUndefined(prevX) ? -1 : prevX;
        prevY = _.isUndefined(prevY) ? -1 : prevY;
        let n: number;

        if (!bitmap) {
            bitmap = new Array2d<number>(height, width, 0);
        }

        if (currentDepth - 1 === maxDepth) {
            return;
        }
        let coords: Array<IPoint> = Hex.getAdjacentCoords(x, y, height, width);

        // Walk thru the adjacent squares and recurse into their neighbors
        for (n = 0; n < coords.length; n++) {
            if (bitmap.get(coords[n].x, coords[n].y) >= currentDepth - maxDepth ||
                bitmap.get(coords[n].x, coords[n].y) === 0
            ) {
                bitmap.set(coords[n].x, coords[n].y, currentDepth);
                callback(coords[n].x, coords[n].y, currentDepth, prevX, prevY);
                Hex.walkAdjacent(coords[n].x, coords[n].y, maxDepth, callback, height, width, currentDepth + 1,
                    bitmap, coords[n].x, coords[n].y);
            }
        }
    }

    /**
     * Converts from screen coordinates to map coordinates.
     * @param {Number} screenX The x coordinate in screen space.
     * @param {Number} screenY The y coordinate in screen space.
     * @return {{x: Number, y: Number}} an {x,y} object of the coordinates containing screen point
     */
    public static convertScreenToMapCoords (screenX: number, screenY: number): IPoint {
        // ----------------------------------------------------------------------
        // --- Determine coordinate of map div as we want the click coordinate as
        // --- we want the mouse click relative to this div.
        // ----------------------------------------------------------------------
        let posX = screenX;
        let posY = screenY;

        let x, y, z, ix, iy, iz, s, absDx, absDy, absDz;

        // ----------------------------------------------------------------------
        // --- Convert mouse click to hex grid coordinate
        // --- Code is from http://www-cs-students.stanford.edu/~amitp/Articles/GridToHex.html
        // ----------------------------------------------------------------------
        x = (posX - (Hex.HEX_HEIGHT / 2)) / (Hex.HEX_HEIGHT * 0.75);
        y = (posY - (Hex.HEX_HEIGHT / 2)) / Hex.HEX_HEIGHT;
        z = -0.5 * x - y;
        y = -0.5 * x + y;

        ix = Math.floor(x + 0.5);
        iy = Math.floor(y + 0.5);
        iz = Math.floor(z + 0.5);
        s = ix + iy + iz;
        if (s) {
            absDx = Math.abs(ix - x);
            absDy = Math.abs(iy - y);
            absDz = Math.abs(iz - z);
            if (absDx >= absDy && absDx >= absDz) {
                ix -= s;
            } else if (absDy >= absDx && absDy >= absDz) {
                iy -= s;
            } else {
                iz -= s;
            }
        }

        // Done!
        return {
            x: ix,
            y: (iy - iz + (1 - ix % 2)) / 2 - 0.5,
        };

    }

    /**
     * Calculates where to start drawing a hex.
     * @param {Number} mapX The x coordinate in map space.
     * @param {Number} mapY The y coordinate in map space.
     * @return {{x: Number, y: Number}} An {x,y} object of the coordinates containing screen point.
     */
    public static _calculateOffsetPosition (mapX: number, mapY: number): IPoint {
        return {
            x: (mapX * Hex.HEX_SIDE * 1.5),
            y: (mapY * Hex.HEX_HEIGHT + (mapX % 2) * Hex.HEX_HEIGHT / 2),
        };
    }

    /**
     * Converts array space coordinates into screen space coordinates.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @returns {{x: number, y: number}} An object representing the point.
     */
    public static convertArrayToScreenCoords (x: number, y: number): IPoint {
        return {
            x: (x * Hex.HEX_SIDE * 1.5),
            y: (y * Hex.HEX_HEIGHT + (x % 2) * Hex.HEX_HEIGHT / 2),
        };
    }

    /**
     * Converts hex space coordinates into array space coordinates.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @returns {{x: number, y: number}} An object representing the point.
     */
    public static convertHexToArrayCoords (x: number, y: number): IPoint {
        return {
            x: x + y,
            y: Math.floor((x + y) / 2) - y,
        };
    }

    /**
     * Converts array space coordinates into hex space coordinates.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @returns {{x: number, y: number}} An object representing the point.
     */
    public static convertArrayToHexCoords (x: number, y: number): IPoint {
        return {
            x: y + Math.ceil(x / 2),
            y: -1 * (y - Math.floor(x / 2)),
        };
    }


    /**
     * Calculates the distance between two points in hex space.
     * @param {{x:number, y:number}} a The x coordinate.
     * @param {{x:number, y:number}} b The y coordinate.
     * @returns {number} The distance between the two points in hexes.
     */
    public static calculateDistanceHexSpace (a: IPoint, b: IPoint): number {
        let dx = b.x - a.x,
            dy = b.y - a.y,
            ret;

        if (Math.sign(dx) !== Math.sign(dy)) {
            ret = Math.max(Math.abs(dx), Math.abs(dy));
        } else {
            ret = Math.abs(dx) + Math.abs(dy);
        }
        return ret;
    }
}

export = Hex;
