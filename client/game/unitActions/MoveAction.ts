'use strict';

import IUnitAction = require('./IUnitAction');
import Array2d = require('../../lib/Array2d');
import MapMask = require('../../lib/MapMask');
import Unit = require('../Unit');
import Game = require('../Game');
import Hex = require('../../lib/Hex');

/**
 * Defines the unit action to move.
 */
class MoveAction implements IUnitAction {

    private _range: number;
    private _terrainCosts: Map<string, number>;

    /**
     * Initializes the action with passed options.
     * @constructor
     * @param {any} options Values to initialize with.
     */
    constructor (options: any) {
        this._range = options.range;
        if (!this._range) { throw new Error('Range must be specified for MoveAction.'); }

        this._terrainCosts = new Map<string, number>();
        _.each(options.terrainCosts, (cost, name) => this._terrainCosts.set(name, cost));
    }

    /* tslint:disable:valid-jsdoc */
    /**
     * @inheritDoc
     */
    public updateMask (game: Game, unit: Unit, mask: MapMask): MapMask {
        if (unit) {
            let actionMap = this._generateMoveMap(unit, game);

            actionMap.each(function (x, y, val) {
                let maskType;

                switch (val) {
                    case 'movable':
                        maskType = MapMask.MaskType.MASK_CLEAR;
                        break;
                    default:
                        maskType = MapMask.MaskType.MASK_BLACK;
                        break;
                }
                mask.setTile(x, y, maskType);
            });
        }
        return mask;
    };

    /**
     * @inheritDoc
     */
    public perform (game, unit, x, y): boolean {
        let actionMap = this._generateMoveMap(unit, game);

        if (actionMap.get(x, y) === 'movable') {
            unit.move(x, y);
            return true;
        }

        return false;
    };
    /* tslint:enable:valid-jsdoc */

    /**
     * Generates the map of possible moves.
     * @param {Unit} unit - unit to generate map for.
     * @param {Game} game - game to generate map in.
     * @return {Array2d} map of identifiers.
     */
    private _generateMoveMap (unit: Unit, game: Game): Array2d<string> {
        let map = game.map,
            zocMask = this._generateZocMap(unit.team, game),
            moveMask = new Array2d(map.height, map.width, 0),
            depthMask = new Array2d(map.height, map.width),
            actionMap;

        let callback = (x, y, currDepth, prevX, prevY) => {
            depthMask.set(x, y, currDepth);
            let hexCost = this._terrainCosts.get(map.getTile(x, y).type.name);
            if (_.isUndefined(hexCost)) { throw new Error('Hex cost not defined for ' + map.getTile(x, y).type.name); }
            let zoc = zocMask.get(x, y);

            if (prevY === -1 && prevX === -1) {
                moveMask.set(x, y, hexCost);
                if (zoc && hexCost < this._range) {
                    if (zoc === 1) {
                        moveMask.set(x, y, this._range);
                    } else {
                        moveMask.set(x, y, Infinity);
                    }
                }

            } else {
                if (depthMask.get(prevX, prevY) <= depthMask.get(x, y)) {
                    if (moveMask.get(prevX, prevY) + hexCost < moveMask.get(x, y) || moveMask.get(x, y) === 0) {
                        hexCost +=  moveMask.get(prevX, prevY);
                        moveMask.set(x, y, hexCost);

                        if (zoc && hexCost < this._range) {
                            if (zoc === 1) {
                                moveMask.set(x, y, this._range);
                            } else {
                                moveMask.set(x, y, Infinity);
                            }
                        }
                    }
                } // end from correct prev
            } // end if/else no prev
        };
        Hex.walkAdjacent(unit.x, unit.y, this._range, callback, map.height, map.width);

        actionMap = moveMask.map((x, y, value) => {
            if (value > this._range || value === 0) {
                return 'invalid';
            }
            return 'movable';
        });

        return actionMap;
    }

    /**
     * Generates a map of opposing teams zone of control.
     * @param {String} team - which team is unit on?
     * @param {Game} game - game to generate for.
     * @return {Array2d} Map where 1 is in ZOC and 2 is enemy unit.
     */
    private _generateZocMap (team: string, game: Game): Array2d<number> {
        let height = game.map.height,
            width = game.map.width,
            zocMap = new Array2d<number>(height, width);

        for (let n = 0; n < game.units.length; n++) {
            if (game.units[n].team !== team) {
                let x = game.units[n].x,
                    y = game.units[n].y;
                let coords = Hex.getAdjacentCoords(x, y, height, width);
                zocMap.setMulti(coords, 1);
            }
        }
        for (let n = 0; n < game.units.length; n++) {
            if (game.units[n].team === team) {
                let x = game.units[n].x,
                    y = game.units[n].y;
                zocMap.set(x, y, 2);
            }
        }

        return zocMap;
    }
}

export = MoveAction;
