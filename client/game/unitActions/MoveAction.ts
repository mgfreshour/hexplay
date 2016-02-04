import IUnitAction = require('./IUnitAction');
import Array2d = require('../../lib/Array2d');
import MapMask = require('../../lib/MapMask');
import Unit = require('../Unit');
import Game = require('../Game');
import Hex = require('../../lib/Hex');

'use strict';

/**
 * Defines the unit action to move.
 */
class MoveAction implements IUnitAction {

    private _range: number;
    private _terrainCosts: Map<string, number>;
    private _hasMoved: boolean = false;

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
    public getOptions (game: Game, unit: Unit): Array<any> {
        return [];
    }

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
    public canPerform (game: Game, unit: Unit): boolean {
        return !this._hasMoved;
    }

    /**
     * @inheritDoc
     */
    public perform (game, unit, x, y, options?: Array<any>): boolean {
        let actionMap = this._generateMoveMap(unit, game);

        if (actionMap.get(x, y) === 'movable') {
            unit.move(x, y);
            this._hasMoved = true;
        }

        return this._hasMoved;
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
            moveMask = new Array2d(map.height, map.width, Infinity),
            actionMap;

        let callback = (x, y, currDepth, prevX, prevY) => {
            let hexCost = this._terrainCosts.get(map.getTile(x, y).type.name);
            if (_.isUndefined(hexCost)) { throw new Error('Hex cost not defined for ' + map.getTile(x, y).type.name); }


            if (prevY !== -1 && prevX !== -1) { // Ignore first pass.
                let prevCost = moveMask.get(prevX, prevY);
                let zoc = zocMask.get(x, y);
                if (zoc) {
                    if (zoc === 'zoc' && (prevCost + hexCost <= this._range)) {
                        hexCost = this._range - prevCost;
                    } else if (zoc === 'unit') { // Unit in this hex
                        hexCost = Infinity;
                    }
                }

                let costFromPrev = prevCost + hexCost;
                if (costFromPrev < moveMask.get(x, y)) {
                    hexCost = costFromPrev;
                    moveMask.set(x, y, hexCost);
                }
            }

        };
        moveMask.set(unit.x, unit.y, 0);
        Hex.walkAdjacent(unit.x, unit.y, this._range, callback, map.height, map.width);

        actionMap = moveMask.map((x, y, value) => {
            if (value > this._range || value === -1) {
                return 'invalid';
            }
            return 'movable';
        });
        actionMap.set(unit.x, unit.y, 'self');

        return actionMap;
    }

    /**
     * Generates a map of opposing teams zone of control.
     * @param {String} team - which team is unit on?
     * @param {Game} game - game to generate for.
     * @return {Array2d} Map where 1 is in ZOC and 2 is enemy unit.
     */
    private _generateZocMap (team: string, game: Game): Array2d<string> {
        let height = game.map.height,
            width = game.map.width,
            zocMap = new Array2d<string>(height, width);

        game.forEachUnit(function (unit, x, y) {
            if (unit.team !== team) {
                let coords = Hex.getAdjacentCoords(x, y, height, width);
                zocMap.setMulti(coords, 'zoc');
            }
            zocMap.set(x, y, 'unit');
        });

        return zocMap;
    }
}

export = MoveAction;
