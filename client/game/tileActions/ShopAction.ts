'use strict';

import ITileAction = require('./ITileAction');
import Game = require('../Game');
import MapMask = require('../../lib/MapMask');

class ShopAction implements ITileAction {
    private _types;

    constructor (options: any) {
        this._types = options.types;
    }

    /* tslint:disable:valid-jsdoc */
    /**
     * @inheritDoc
     */
    public updateMask (game: Game, x: number, y: number, mask: MapMask): MapMask {
        return mask;
    }

    /**
     * @inheritDoc
     */
    public perform (game: Game, x: number, y: number): boolean {
        let ret = false;
        return ret;
    }
    /* tslint:enable:valid-jsdoc */
}

export = ShopAction;
