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
    private _unitPositions: Array<any>;
    get unitPositions () { return this._unitPositions; }

    constructor (options) {
        this._player = options.player;
        this._unitPositions = options.unitPositions;
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

    public loadTurns (turns: Array<{ team: string, unitPositions: [any] }>) {
        assert(Array.isArray(this._players) && this._players.length > 1, 'Game - Players required');
        let playerMap = new Map<string, Player>();
        _.each(this.players, (player) => playerMap.set(player.team, player));
        this._turns = [];
        _.each(turns, (turn) => {
            assert(turn.team === this.nextPlayer().team, 'Invalid turn order detected!');
            this._turns.push(new Turn({ player: playerMap.get(turn.team), unitPositions: turn.unitPositions }));
        });
        this.loadUnits(this._turns[this._turns.length - 1].unitPositions);
    }
    public get currentTurn (): Turn {
        return this._turns[this._turns.length - 1];
    }
    public get currentPlayer (): Player {
        return this.currentTurn.player;
    }
    public nextPlayer () {
        let pIdx = _.findIndex(this._players, this.currentPlayer) + 1;
        if (pIdx > this._players.length) {
            pIdx = 0;
        }
        return this._players[pIdx];
    }
    public nextTurn () {
        this.turns.push(new Turn({ player: this.nextPlayer() }));
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
