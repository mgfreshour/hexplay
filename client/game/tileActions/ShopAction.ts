'use strict';

import ITileAction = require('./ITileAction');
import Game = require('../Game');
import MapMask = require('../../lib/MapMask');

class ShopAction implements ITileAction {
    private _types: Array<string>;

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
    public getOptions (game: Game, x: number, y: number): Array<any> {
        return [];
    }

    /**
     * @inheritDoc
     */
    public perform (game: Game, x: number, y: number, options?: Array<string>): boolean {
        return false;
    }

    /**
     * @inheritDoc
     */
    public canPerform (game: Game, x: number, y: number): boolean {
        return !game.getUnit(x, y);
    }
    /* tslint:enable:valid-jsdoc */
}

export = ShopAction;
