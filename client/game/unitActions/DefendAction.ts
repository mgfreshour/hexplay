import IUnitAction = require('./IUnitAction');
import Array2d = require('../../lib/Array2d');
import MapMask = require('../../lib/MapMask');
import Unit = require('../Unit');
import Game = require('../Game');
import Hex = require('../../lib/Hex');

'use strict';

/**
 * Defines the unit action to defend itself.
 */
class DefendAction implements IUnitAction {
    /**
     * Initializes the action with passed options.
     * @constructor
     * @param {any} options Values to initialize with.
     */
    constructor (options: any) {

    }

    /* tslint:disable:valid-jsdoc */
    /**
     * @inheritDoc
     */
    public getOptions (game: Game, unit: Unit): Array<any> {
        return [];
    }

    /**
     * @inheritDoc
     */
    public updateMask (game: Game, unit: Unit, mask: MapMask): MapMask {
        return mask;
    };


    /**
     * @inheritDoc
     */
    public canPerform (game: Game, unit: Unit): boolean {
        return false;
    }

    /**
     * @inheritDoc
     */
    public perform (game, unit, x, y, options: Array<any>): boolean {
        return false;
    };
    /* tslint:enable:valid-jsdoc */
}

export = DefendAction;
