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
    protected gfxContainer: createjs.Container;
    /**
     * Text to draw.
     */
    public text: any;
    /**
     * Image to draw.
     */
    public img: any;
    public imgX: number;
    public imgY: number;

    /**
     * Constructor.
     * @param {any} options Creation options.
     */
    constructor (options?: any) {
        super();
        this.img = options.img;
        this.imgX = options.imgX;
        this.imgY = options.imgY;
        this.text = options.text;
        this.gfxContainer = options.gfxContainer;
    }
}

export = Renderable;
