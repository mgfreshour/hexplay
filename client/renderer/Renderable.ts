'use strict';

/// <reference path="../../typings/easeljs/easeljs.d.ts" />

/**
 * @class Renderable
 * @constructor
 */
class Renderable {
    private gfxContainer: createjs.Container;
    private text: any;
    private img: any;

    /**
     * Constructor.
     */
    constructor (options: Object) {
        this.img = options.img || undefined;
        this.text = options.text || undefined;
        this.gfxContainer = options.gfxContainer || undefined;
    }
}

export = Renderable;
