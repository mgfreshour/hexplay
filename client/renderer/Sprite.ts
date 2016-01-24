import Renderable = require('./Renderable');

'use strict';

/**
 * A Sprite is a renderable object that contains it's own position in world space
 * @class Sprite
 * @constructor
 * @extends Renderable
 */
class Sprite extends Renderable {
    /**
     *
     */
    private x: number = 0;
    private y: number = 0;

    /**
     * Constructor.
     */
    constructor () {
        super();
    }

    /**
     * Moves a sprite to x,y in world space.  NOTE: this doesn't check world space bounds.
     * @param {Number} x
     * @param {Number} y
     */
    public move (x, y) {
        this.x = x;
        this.y = y;
        this.emit('move', this, x, y);
    }

}

export = Sprite;
