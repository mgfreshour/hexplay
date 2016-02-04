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
     * @param {Array<any>} [options]
     * @return {Boolean} did the action perform?
     */
    perform (game: Game, unit: Unit, x: number, y: number, options?: Array<any>): boolean;

    /**
     * Returns whether or not the passes unit is capable of performing action.
     * @method updateMask
     * @param {GameMap} game
     * @param {Unit} unit
     */
    canPerform (game: Game, unit: Unit): boolean;

    /**
     * Gets available options for the action.
     * @param {Game} game Game this action belongs to.
     * @param {Unit} unit Game unit that will perform action.
     * @return {Boolean} Array of options.
     */
    getOptions (game: Game, unit: Unit): Array<any>;
}

export = IUnitAction;
