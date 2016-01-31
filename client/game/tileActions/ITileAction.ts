'use strict';

import MapMask = require('../../lib/MapMask');
import Game = require('../Game');

/**
 * Defines an action a tile can perform.
 * @class ITileAction
 * @interface
 */
interface ITileAction {
    /**
     * Updates a mask to represent actions.
     * @method updateMask
     * @param {GameMap} game
     * @param {Number} x
     * @param {Number} y
     * @param {MapMask} mask
     */
    updateMask (game: Game, x: number, y: number, mask: MapMask): MapMask;

    /**
     * Performs action.
     * @method perform
     * @param {GameMap} game
     * @param {Number} x
     * @param {Number} y
     * @return {Boolean} did the action perform?
     */
    perform (game: Game, x: number, y: number): boolean;
}

export = ITileAction;
