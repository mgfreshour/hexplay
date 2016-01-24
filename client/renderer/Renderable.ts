'use strict';

import events = require('events');
/// <reference path='../../typings/tsd.d.ts' />

/**
 * @class Renderable
 * @constructor
 */
class Renderable extends events.EventEmitter {
    /**
     * The container drawn on screen.
     */
    private gfxContainer: createjs.Container;
    /**
     * Text to draw.
     */
    private text: any;
    /**
     * Image to draw.
     */
    private img: any;

    /**
     * Constructor.
     * @param {any} options Creation options.
     */
    constructor (options?: any) {
        super();
        this.img = options.img || undefined;
        this.text = options.text || undefined;
        this.gfxContainer = options.gfxContainer || undefined;
    }
}

export = Renderable;
