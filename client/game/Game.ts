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
        let actions = new Array<string>();
        //let tile = this._map.getTile(point.x, point.y);
        //let unit = this._map.getUnit(point.x, point.y);

        return actions;
    }

    public forEachUnit (cb: (unit: Unit, x: number, y: number) => void) {
        _.each(this._units, (unit) => cb(unit, unit.x, unit.y));
    }
}

export = Game;
