'use strict';

import IAction = require('./IAction');
import Array2d = require('../../lib/Array2d');
import MapMask = require('../../lib/MapMask');

/**
 * Defines the unit action to move.
 * @class Move
 * @implements IAction
 */
class Move implements IAction {

    /* tslint:disable:valid-jsdoc */
    /**
     * @inheritDoc
     */
    public updateMask (game, unit, mask): MapMask {
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
     * @param {Game} game
     * @returns {Array2d}
     * @private
     */
    private _calculateActionMap (unit, game): Array2d {
        let map = game.get('map'),
            actionMap = new Array2d(map.get('height'), map.get('width'), 'movable');

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

export = Move;
