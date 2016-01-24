'use strict';

import events = require('events');
import IPoint = require('./IPoint');

/**
 * Class that represents a 2d array.
 * @class Array2d
 */
class Array2d<T> extends events.EventEmitter {
    private data: Array<Array<T>>;
    private height: number;
    private width: number;

    /**
     * The constructor.
     * @constructor
     * @param {number} [height] The height of the array.
     * @param {number} [width] The width of the array.
     * @param {*} [value] The value to fill the array with on creation. Defaults to 0.
     */
    constructor (height?: number, width?: number, value?: T) {
        super();
        if (height && width) {
            this.generate(height, width, value);
        }
    }

    /**
     * Creates the internal structure for the 2d array.
     * @param {number} [height] The height of the array.
     * @param {number} [width] The width of the array.
     * @param {*} [value] The value to fill the array with on creation. Defaults to 0.
     * @param {Function} [cloneFn] function to use to copy the value. Defaults to value.clone().
     */
    public generate (height?: number, width?: number, value?: T, cloneFn?: (item: T) => T): void {
        let sy: number, sx: number, row: Array<any>;
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
                    throw new Error('No clone function on object, and none passed in.');
                } else { // primitive.. hopefully  :)
                    row.push(value);
                }
            }
            this.data.push(row);
        }
    }

    /**
     * Iterates through each value in the array and passes it to callback function.
     * @param {Function} callback Receives x, y, and the value at that location.
     */
    public each (callback: (x: number, y: number, item: T) => void): void {
        let x: number, y: number;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                callback(x, y, this.data[y][x]);
            }

        }
    }

    /**
     * Fills the array with whatever value was passed.
     * @param {*} value The value to fill the array with.
     */
    public fill (value: any): void {
        let x: number, y: number;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                this.set(x, y, value);
            }
        }
    }

    /**
     * Iterates through each value in the array and passes it to callback function, then sets the value to what the callback returned.
     * @param {Function} callback Receives x, y, and the value at that location, returns value that should replace it.
     */
    public map (callback: (x: number, y: number, item: T) => T): void {
        let x: number, y: number;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                this.data[y][x] = callback(x, y, this.data[y][x]);
            }
        }
    }

    /**
     * Sets multiple coordinate values at once.
     * @param {Array.<{x: number, y: number}>} coords The array of {x,y} objects that represent the coordinates.
     * @param {Object} value The value to set all the places as.
     */
    public setMulti (coords: Array<IPoint>, value: T): void {
        let n: number;
        for (n = 0; n < coords.length; n++) {
            this.set(coords[n].x, coords[n].y, value);
        }
    }

    /**
     * Sets the value at a coordinate.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     * @param {Object} value The value to set in space.
     * @param {Function} [cloneFn] The function used to clone the value if it is an object. Defaults to value.clone.
     * @emits change event, passing x, y, new value and old value.
     */
    public set (x: number, y: number, value: T, cloneFn?: (item: T) => T): void {
        let old: any = this.get(x, y);
        if (typeof cloneFn === 'function') {
            this.data[y][x] = cloneFn(value);
        }
        if (typeof value === 'object') {
            throw new Error('No clone function on object, and none passed in.');
        } else { // primitive.. hopefully  :)
            this.data[y][x] = value;
        }

        this.emit('change', x, y, value, old);
    }


    /**
     * Gets the value at a coordinate.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     * @returns {*} The value at those coordinates.
     */
    public get (x: number, y: number): any {
        return this.data[y][x];
    }

    /**
     * Returns the internal data structure
     * @returns {Array<any>}
     */
    public getInternalData (): Array<Array<T>> {
        return this.data;
    }

    /**
     * Returns the height of the map.
     * @returns {number} The height of the array.
     */
    public getHeight (): number {
        return this.data.length;
    }

    /**
     * Returns the width of the map.
     * @returns {number} The width of the array.
     */
    public getWidth (): number {
        return this.data[0].length;
    }

    /**
     * Creates a printable string representation of the 2d array.
     * @return {string} string representation of array.
     */
    public toString (): string {
        let out: string = '', x: number, y: number;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                out += '[' + this.data[y][x] + ']';
            }
            out += '\n';
        }

        return out;
    }

}

export = Array2d;
