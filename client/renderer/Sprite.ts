import Renderable = require('./Renderable');

'use strict';

/**
 * A Sprite is a renderable object that contains it's own position in world space
 * @class Sprite
 * @constructor
 * @extends Renderable
 */
class Sprite extends Renderable {
    private x: number;
    private y: number;

    /**
     * Constructor.
     * @param {any} options Object of properties to set.
     */
    constructor (options) {
        super(options);
        this.x = options.x || 0;
        this.y = options.y || 0;
    }

    /**
     * Moves a sprite to x,y in world space.  NOTE: this doesn't check world space bounds.
     * @param {Number} x World space position to move to.
     * @param {Number} y World space position to move to.
     */
    public move (x, y) {
        this.x = x;
        this.y = y;
        this.emit('move', this, x, y);
    }

}

export = Sprite;
