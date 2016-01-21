'use strict';

var Array2d = require('./Array2d');
var _ = require('lodash');

/**
 * Class that contains functions for working with a hex map.
 * @class Hex
 */
class Hex {
    /**
     * Returns the X,Y coordinates of all valid adjacent hex.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} height The height of 2d array representing the hex map.
     * @param {Number} width The width of 2d array representing the hex.
     * @return {Array.<{x: number, y: number}>} array of {x, y} Objects representing adjacent coordinates.
     */
    static getAdjacentCoords (x, y, height, width) {
        var possible = null, n;
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
                {x: x - 1, y: y + 1}
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
                {x: x - 1, y: y}
                //{x:x-1, y:y+1}
            ];
        }
        var ret = [];

        for (n = 0; n < possible.length; n++) {
            if (possible[n].x >= 0 && possible[n].x < width && possible[n].y >= 0 && possible[n].y < height) {
                ret.push(possible[n]);
            }
        }

        return ret;
    };


    /**
     * Recursively walks a hex map starting from x,y and iterating through adjacent hex.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} max_depth how far from the starting hex to walk.  Defaults to 1.
     * @param {Function} callback function to call with each step
     * @param {Number} height is the height of 2d bitmap representing the hex map
     * @param {Number} width is the height of 2d bitmap representing the hex map
     * @param {Number} [current_depth] (used on recursion only!) how far we've recursed from original point
     * @param {Array2d} [bitmap] (used on recursion only!) contains info about which hex's we've visited
     * @param {Number|undefined} [prev_x] coordinate of the hex we're recursing from
     * @param {Number|undefined} [prev_y] coordinate of the hex we're recursing from
     */
    static walkAdjacent (x, y, max_depth, callback, height, width, current_depth, bitmap, prev_x, prev_y) {
        current_depth = current_depth || 1;
        max_depth = max_depth || 1;
        prev_x = _.isUndefined(prev_x) ? -1 : prev_x;
        prev_y = _.isUndefined(prev_y) ? -1 : prev_y;
        var n;

        if (!bitmap) {
            bitmap = new Array2d(height, width);
        }

        if (current_depth - 1 === max_depth) {
            return;
        }
        var coords = Hex.getAdjacentCoords(x, y, height, width);

        // Walk thru the adjacent squares and recurse into their neighbors
        for (n = 0; n < coords.length; n++) {
            if (bitmap.get(coords[n].x, coords[n].y) >= current_depth - max_depth ||
                bitmap.get(coords[n].x, coords[n].y) === 0
            ) {
                bitmap.set(coords[n].x, coords[n].y, current_depth);
                callback(coords[n].x, coords[n].y, current_depth, prev_x, prev_y);
                Hex.walkAdjacent(coords[n].x, coords[n].y, max_depth, callback, height, width, current_depth + 1,
                    bitmap, coords[n].x, coords[n].y);
            }
        }
    };

    /**
     * Converts from screen coordinates to map coordinates.
     * @param {Number} screenX The x coordinate in screen space.
     * @param {Number} screenY The y coordinate in screen space.
     * @return {{x: Number, y: Number}} an {x,y} object of the coordinates containing screen point
     */
    static convertScreenToMapCoords (screenX, screenY) {
        // ----------------------------------------------------------------------
        // --- Determine coordinate of map div as we want the click coordinate as
        // --- we want the mouse click relative to this div.
        // ----------------------------------------------------------------------
        var posX = screenX;
        var posY = screenY;

        var x, y, z, ix, iy, iz, s, abs_dx, abs_dy, abs_dz;

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
            abs_dx = Math.abs(ix - x);
            abs_dy = Math.abs(iy - y);
            abs_dz = Math.abs(iz - z);
            if (abs_dx >= abs_dy && abs_dx >= abs_dz) {
                ix -= s;
            } else if (abs_dy >= abs_dx && abs_dy >= abs_dz) {
                iy -= s;
            } else {
                iz -= s;
            }
        }

        // Done!
        return {
            x: ix,
            y: (iy - iz + (1 - ix % 2)) / 2 - 0.5
        };

    };

    /**
     * Calculates where to start drawing a hex.
     * @param {Number} mapX The x coordinate in map space.
     * @param {Number} mapY The y coordinate in map space.
     * @return {{x: Number, y: Number}} An {x,y} object of the coordinates containing screen point.
     */
    static _calculateOffsetPosition (mapX, mapY) {
        return {
            x: (mapX * Hex.HEX_SIDE * 1.5),
            y: (mapY * Hex.HEX_HEIGHT + (mapX % 2) * Hex.HEX_HEIGHT / 2)
        };
    };

    /**
     * Converts array space coordinates into screen space coordinates.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @returns {{x: number, y: number}} An object representing the point.
     */
    static convertArrayToScreenCoords (x, y) {
        return {
            x: (x * Hex.HEX_SIDE * 1.5),
            y: (y * Hex.HEX_HEIGHT + (x % 2) * Hex.HEX_HEIGHT / 2)
        };
    };

    /**
     * Converts hex space coordinates into array space coordinates.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @returns {{x: number, y: number}} An object representing the point.
     */
    static convertHexToArrayCoords (x, y) {
        return {
            x: x + y,
            y: Math.floor((x + y) / 2) - y
        };
    };

    /**
     * Converts array space coordinates into hex space coordinates.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @returns {{x: number, y: number}} An object representing the point.
     */
    static convertArrayToHexCoords (x, y) {
        return {
            x: y + Math.ceil(x / 2),
            y: -1 * (y - Math.floor(x / 2))
        };
    };


    /**
     * Calculates the distance between two points in hex space.
     * @param {{x:number, y:number}} a The x coordinate.
     * @param {{x:number, y:number}} b The y coordinate.
     * @returns {number} The distance between the two points in hexes.
     */
    static calculateDistanceHexSpace (a, b) {
        var dx = b.x - a.x,
            dy = b.y - a.y,
            ret;

        if (Math.signum(dx) !== Math.signum(dy)) {
            ret = Math.max(Math.abs(dx), Math.abs(dy));
        } else {
            ret = Math.abs(dx) + Math.abs(dy);
        }
        return ret;
    };
}

/**
 * The height of a hex in pixels
 * @const
 * @type {Number}
 */
Hex.HEX_HEIGHT = 72;

/**
 * The height of a hex in pixels
 * @const
 * @type {Number}
 */
Hex.HEX_WIDTH = 72;

/**
 * The length of one of the sides of a hex in pixels (all 6 sides should be equal).
 * @const
 * @type {Number}
 */
Hex.HEX_SIDE = Hex.HEX_HEIGHT / 2;



module.exports = Hex;
