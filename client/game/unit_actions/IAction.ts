'use strict';

import MapMask = require('../../lib/MapMask');

/**
 * Definese a class that can draw a RenderableItem
 * @class IAction
 * @interface
 */
interface IAction {

    /**
     * Updates a mask to represent actions
     * @method updateMask
     * @param {Game} game
     * @param {Unit} unit
     * @param {MapMask} mask
     */
    updateMask (game, unit, mask): MapMask;

    /**
     * Performs action
     * @method perform
     * @param {Game} game
     * @param {Unit} unit
     * @param {Number} x
     * @param {Number} y
     * @return {Boolean} did the action perform?
     */
    perform (game, unit, x: number, y: number): boolean;
}

export = IAction;
