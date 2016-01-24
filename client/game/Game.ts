import GameMap = require('./GameMap');
'use strict';

class Game {
    private map: GameMap;

    constructor (options) {

    }

    public getMap (): GameMap {
        return this.map;
    }
}

export = Game;
