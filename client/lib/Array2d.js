'use strict';

var EventEmitter = require('events');

/**
 * Class that represents a 2d array.
 * @class Array2d
 */
class Array2d extends EventEmitter {
    /**
     * The constructor.
     * @constructor
     * @param {Number} [height] The height of the array.
     * @param {Number} [width] The width of the array.
     * @param {*} [value] The value to fill the array with on creation. Defaults to 0.
     */
    constructor (height, width, value) {
        super();
        value = value || 0;
        if (height && width) {
            this.generate(height, width, value);
        }
    }

    /**
     * Creates the internal structure for the 2d array.
     * @param {Number} [height] The height of the array.
     * @param {Number} [width] The width of the array.
     * @param {Object} [value] The value to fill the array with on creation. Defaults to 0.
     * @param {Function} [cloneFn] function to use to copy the value. Defaults to value.clone().
     */
    generate (height, width, value, cloneFn) {
        var sy, sx, row;
        value = value || 0;
        this.data = [];
        this.height = height;
        this.width = width;
        for (sy = 0; sy < height; sy++) {
            row = [];
            for (sx = 0; sx < width; sx++) {
                if (typeof cloneFn === 'function') {
                    row.push(cloneFn(value));
                }
                if (typeof value === 'object') {
                    if (value.clone && typeof value.clone === 'function') {
                        row.push(value.clone());
                    } else {
                        throw new Error('No clone function on object, and none passed in.');
                    }
                } else { // primitive.. hopefully  :)
                    row.push(value);
                }
            }
            this.data.push(row);
        }
    };

    /**
     * Iterates through each value in the array and passes it to callback function.
     * @param {Function} callback Receives x, y, and the value at that location.
     */
    each (callback) {
        var x, y;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                callback(x, y, this.data[y][x]);
            }

        }
    };

    /**
     * Fills the array with whatever value was passed.
     * @param {*} value The value to fill the array with.
     */
    fill (value) {
        var x, y;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                this.set(x, y, value);
            }
        }
    };

    /**
     * Iterates through each value in the array and passes it to callback function, then sets the value to what the callback returned.
     * @param {Function} callback Receives x, y, and the value at that location, returns value that should replace it.
     */
    map (callback) {
        var x, y;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                this.data[y][x] = callback(x, y, this.data[y][x]);
            }
        }
    };

    /**
     * Sets multiple coordinate values at once.
     * @param {Array.<{x: number, y: number}>} coords The array of {x,y} objects that represent the coordinates.
     * @param {Object} value The value to set all the places as.
     */
    setMulti (coords, value) {
        var n;
        for (n = 0; n < coords.length; n++) {
            this.set(coords[n].x, coords[n].y, value);
        }
    };

    /**
     * Sets the value at a coordinate.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Object} value The value to set in space.
     * @param {Function} [cloneFn] The function used to clone the value if it is an object. Defaults to value.clone.
     * @emits change event, passing x, y, new value and old value.
     */
    set (x, y, value, cloneFn) {
        var old = this.get(x, y);
        if (typeof cloneFn === 'function') {
            this.data[y][x] = cloneFn(value);
        }
        if (typeof value === 'object') {
            if (value.clone && typeof value.clone === 'function') {
                this.data[y][x] = value.clone();
            } else {
                throw new Error('No clone function on object, and none passed in.');
            }
        } else { // primitive.. hopefully  :)
            this.data[y][x] = value;
        }

        this.emit('change', x, y, value, old);
    };


    /**
     * Gets the value at a coordinate.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @returns {*} The value at those coordinates.
     */
    get (x, y) {
        return this.data[y][x];
    };

    /**
     * Returns the height of the map.
     * @returns {number} The height of the array.
     */
    getHeight () {
        return this.data.length;
    };

    /**
     * Returns the width of the map.
     * @returns {number} The width of the array.
     */
    getWidth () {
        return this.data[0].length;
    };

    /**
     * Creates a printable string representation of the 2d array.
     * @return {String} String representation of array.
     */
    toString () {
        var out = '', x, y;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                out += '[' + this.data[y][x] + ']';
            }
            out += '\n';
        }

        return out;
    };

}

module.exports = Array2d;
