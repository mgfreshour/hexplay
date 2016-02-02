import MapMask = require('../../lib/MapMask');
import Game = require('../Game');

'use strict';

/**
 * Defines an action a tile can perform.
 * @class ITileAction
 * @interface
 */
interface ITileAction {
    /**
     * Updates a mask to represent actions.
     * @method updateMask
     * @param {Game} game Game this action belongs to.
     * @param {Number} x Coordinate of the tile.
     * @param {Number} y Coordinate of the tile.
     * @param {MapMask} mask
     */
    updateMask (game: Game, x: number, y: number, mask: MapMask): MapMask;

    /**
     * Performs action.
     * @method perform
     * @param {Game} game Game this action belongs to.
     * @param {Number} x Coordinate of the tile.
     * @param {Number} y Coordinate of the tile.
     * @param {Array<string> [options] List of options to apply to action.
     * @return {Boolean} did the action perform?
     */
    perform (game: Game, x: number, y: number, options?: Array<string>): boolean;

    /**
     * Tells if a tile can perform an action.
     * @method canPerform
     * @param {Game} game Game this action belongs to.
     * @param {Number} x Coordinate of the tile.
     * @param {Number} y Coordinate of the tile.
     * @return {Boolean} did the action perform?
     */
    canPerform (game: Game, x: number, y: number): boolean;

    /**
     * Gets available options for the action.
     * @param {Game} game Game this action belongs to.
     * @param {Number} x Coordinate of the tile.
     * @param {Number} y Coordinate of the tile.
     * @return {Boolean} Array of options.
     */
    getOptions (game: Game, x: number, y: number): Array<any>;
}

export = ITileAction;
