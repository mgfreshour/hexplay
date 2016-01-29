import Renderable = require('./Renderable');

'use strict';

/**
 * A Sprite is a renderable object that contains it's own position in world space.
 * @class Sprite
 * @extends Renderable
 */
class Sprite extends Renderable {
    private _x: number;
    private _y: number;

    get x () { return this._x; }
    get y () { return this._y; }

    /**
     * Constructor.
     * @constructor
     * @param {any} options Object of properties to set.
     */
    constructor (options) {
        super(options);
        this._x = options.x || 0;
        this._y = options.y || 0;
    }

    /**
     * Moves a sprite to x,y in world space.  NOTE: this doesn't check world space bounds.
     * @param {Number} x World space position to move to.
     * @param {Number} y World space position to move to.
     */
    public move (x, y) {
        this._x = x;
        this._y = y;
        this.emit('move', this, x, y);
    }

}

export = Sprite;
