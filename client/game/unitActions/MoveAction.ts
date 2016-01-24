'use strict';

import IUnitAction = require('./IUnitAction');
import Array2d = require('../../lib/Array2d');
import MapMask = require('../../lib/MapMask');
import Unit = require('../Unit');
import Game = require('../Game');

/**
 * Defines the unit action to move.
 * @class MoveAction
 * @implements IUnitAction
 */
class MoveAction implements IUnitAction {

    /* tslint:disable:valid-jsdoc */
    /**
     * @inheritDoc
     */
    public updateMask (game: Game, unit: Unit, mask: MapMask): MapMask {
        if (unit) {
            let actionMap = this._calculateActionMap(unit, game);

            actionMap.each(function (x, y, val) {
                let maskType;

                switch (val) {
                    case 'movable':
                        maskType = MapMask.MaskType.MASK_CLEAR;
                        break;
                    case 'attack':
                        maskType = MapMask.MaskType.MASK_RED_OUTLINE;
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
        let actionMap = this._calculateActionMap(unit, game);

        if (actionMap.get(x, y) === 'movable') {
            unit.move(x, y);
            return true;
        }

        return false;
    };
    /* tslint:enable:valid-jsdoc */

    /**
     * @method _calculateActionMap
     * @param {Unit} unit
     * @param {GameMap} game
     * @returns {Array2d}
     * @private
     */
    private _calculateActionMap (unit, game): Array2d<string> {
        let map = game.getMap(),
            actionMap = new Array2d<string>(map.height, map.width, 'movable');

        actionMap.set(unit.get('x'), unit.get('y'), 'nothing');

        game.forEachUnit(function (otherUnit, x, y) {
            if (unit.get('team') !== otherUnit.get('team')) {
                actionMap.set(x, y, 'attack');
            } else {
                actionMap.set(x, y, 'invalid');
            }
        });

        return actionMap;
    };
}

export = MoveAction;
