'use strict';

import MapMask = require('../../lib/MapMask');
import Unit = require('../Unit');
import Game = require('../Game');

/**
 * Defines an action a unit can perform.
 * @class IUnitAction
 * @interface
 */
interface IUnitAction {
    /**
     * Updates a mask to represent actions.
     * @method updateMask
     * @param {GameMap} game
     * @param {Unit} unit
     * @param {MapMask} mask
     */
    updateMask (game: Game, unit: Unit, mask: MapMask): MapMask;

    /**
     * Performs action.
     * @method perform
     * @param {GameMap} game
     * @param {Unit} unit
     * @param {Number} x
     * @param {Number} y
     * @return {Boolean} did the action perform?
     */
    perform (game: Game, unit: Unit, x: number, y: number): boolean;
}

export = IUnitAction;
