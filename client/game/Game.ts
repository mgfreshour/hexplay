import GameMap = require('./GameMap');
import IPoint = require('../lib/IPoint');
import Unit = require('./Unit');
import _ = require('lodash');
import Player = require('./Player');
import assert = require('assert');
'use strict';

class Turn {
    private _player: Player;
    get player () { return this._player; }

    constructor (options) {
        this._player = options.player;
    }
}

class Game {
    private _units: Array<Unit>;
    get units () { return this._units; }
    private _map: GameMap;
    get map () { return this._map; }
    private _players: Array<Player>;
    get players () { return this._players; }
    private _turns: Array<Turn>;
    get turns () { return this._turns; }

    constructor (options) {
        this._map = options.map;
        assert(this._map, 'Game - Map required');
        this._players = options.players;
        this.loadUnits(options.units);
        if (options.turns) {
            this.loadTurns(options.turns);
        }
    }

    public loadTurns (turns: Array<Turn>) {
        assert(Array.isArray(this._players) && this._players.length > 1, 'Game - Players required');
        this._turns = [];

    }
    public get currentTurn (): Turn {
        return this._turns[this._turns.length - 1];
    }
    public get currentPlayer (): Player {
        return this.currentTurn.player;
    }
    public nextTurn () {
        let pIdx = _.findIndex(this._players, this.currentPlayer) + 1;
        if (pIdx > this._players.length) {
            pIdx = 0;
        }
        this.turns.push(new Turn({ player: this._players[pIdx] }));
    }

    /**
     * Loads the data for units into game.
     * @param {Array<any>} data Unit information to load.
     */
    public loadUnits (data: Array<any>): void {
        this._units = [];
        if (Array.isArray(data)) {
            for (let n = 0; n < data.length; n++) {
                this.createUnit(data[n]);
            }
        }
    }

    /**
     * Returns the name of all available actions at a map point.
     * @param {IPoint} point Location on map.
     * @returns {Array} List of action names.
     */
    public getAllowedActions (point: IPoint): Array<string> {
        let actions = [];
        let tile = this._map.getTile(point.x, point.y);
        tile.actions.forEach((action, name) => {
            if (action.canPerform(this, point.x, point.y)) {
                actions.push(name);
            }
        });
        let unit = _.find(this._units, point);
        if (unit) {
            unit.actions.forEach((action, name) => {
                if (action.canPerform(this, unit)) {
                    actions.push(name);
                }
            });
        }

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
     * @returns {Unit|undefined} Unit found at that location or undefined.
     */
    public getUnit (x: number, y: number): Unit {
        return _.find(this._units, { x: x, y: y });
    }
}

export = Game;
