import GameMap = require('./GameMap');
import IPoint = require('../lib/IPoint');
import Unit = require('./Unit');
import _ = require('lodash');
'use strict';

class Game {
    private _map: GameMap;
    private _units: Array<Unit>;

    get units () { return this._units; }
    get map () { return this._map; }

    constructor (options) {
        this._map = options.map;
        this._units = [];
    }

    public getAllowedActions (point: IPoint): Array<string> {
        let actions = [];
        //let tile = this._map.getTile(point.x, point.y);
        let unit = _.find(this._units, point);
        actions = actions.concat(unit.actions.keys());

        return actions;
    }

    /**
     * Creates a unit in the game.
     * @param {Object} options Unit creation params.
     * @returns {Unit} Created unit.
     * @throws If requested x/y are outside of the map.
     */
    public createUnit (options: any): Unit {
        let unit = Unit.createUnitForTypeIndex(options);
        if (unit.x > this._map.width || unit.y > this._map.height) {
            throw new Error('Unit coordinates are outside of game map!');
        }
        this._units.push(unit);
        return unit;
    }

    /**
     * Loops through all the units in the game.
     * @param {Function} cb called with the unit and the unit's x, y coordinates at each iteration.
     */
    public forEachUnit (cb: (unit: Unit, x: number, y: number) => void) {
        _.each(this._units, (unit) => cb(unit, unit.x, unit.y));
    }

    /**
     * Gets a unit at location.
     * @param {Number} x Coordinate of request.
     * @param {Number} y Coordinate of request.
     * @returns {Unit|undefined}
     */
    public getUnit (x: number, y: number): Unit {
        return _.find(this._units, { x: x, y: y });
    }
}

export = Game;
