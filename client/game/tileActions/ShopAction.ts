'use strict';

import ITileAction = require('./ITileAction');
import Game = require('../Game');
import MapMask = require('../../lib/MapMask');
import assert = require('assert');

class ShopAction implements ITileAction {
    private _types: Array<string>;

    constructor (options: any) {
        this._types = options.types;
        assert(this._types, 'types required');
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
        return this._types;
    }

    /**
     * @inheritDoc
     */
    public perform (game: Game, x: number, y: number, options?: any): boolean {
        assert(this.canPerform(game, x, y), 'invalid action');
        assert(options.team, 'team required');
        assert(options.type, 'type required');
        assert(this._types[options.type], 'invalid type');

        game.createUnit({ type: options.type, team: options.team, x: x, y: y });
        return true;
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
