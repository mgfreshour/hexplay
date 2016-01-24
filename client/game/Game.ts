import GameMap = require('./GameMap');
import IPoint = require('../lib/IPoint');
'use strict';

class Game {
    private map: GameMap;

    constructor (options) {
        this.map = options.map;
    }

    public getMap (): GameMap {
        return this.map;
    }

    public getAllowedActions (point: IPoint): Array<string> {
        let actions = new Array<string>();
        let tile = this.map.getTile(point.x, point.y);
        let unit = this.map.getUnit(point.x, point.y);

        return actions;
    }
}

export = Game;
