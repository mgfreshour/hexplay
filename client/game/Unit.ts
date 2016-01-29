'use strict';

//import Hex = require('../lib/Hex');
import IUnitAction = require('./unitActions/IUnitAction');
import UnitType = require('./UnitType');
import Sprite = require('../renderer/Sprite');

/**
 * Represents a single unit in the game.
 * @class Unit
 * @constructor
 */
class Unit extends Sprite {
    private _type: UnitType;
    private _health: number;
    private _team: string;
    private _acted: boolean;
    private _actions: Map<string, IUnitAction>;


    get type () { return this._type; }
    get health () { return this._health; }
    get team () { return this._team; }
    get acted () { return this._acted; }

    /**
     * Constructor.
     * @param {any} options Object of properties to set.
     */
    constructor (options: any) {
        super(options);
        this._type = options.type;
        this._team = options.team;
        this._health = options.health;
        this._acted = options.acted;

        if (!this._type) { throw new Error('Type is required in Unit creation.'); }
        if (!this._team) { throw new Error('Team is required in Unit creation.'); }

        this._actions = new Map<string, IUnitAction>();
    }

    /**
     * Creates a unit of passed type for team.
     * @static
     * @param {Number} typeIndex Index into type array.
     * @param {Number} team Index of team.
     * @param {Number} [health] Health the unit should have.
     * @return {Unit} New Unit.
     */
    public static createUnitForTypeIndex (typeIndex, team?, health?) {
        let unit, type = UnitType.getType(typeIndex);
            //img = [], text = [];
        //health = health || unitType.startingHealth;

        if (!type) {
            throw 'Unit type not found ' + typeIndex;
        }

        // Unit graphic
        //img.push({
        //    src: unitType.img,
        //    x: unitType.imgX,
        //    y: unitType.imgY,
        //    height: Hex.HEX_HEIGHT,
        //    width: Hex.HEX_WIDTH,
        //});
        //// Team graphic
        //img.push({
        //    src: '/images/misc/flag-' + team + '-icon.png',
        //    height: 24,
        //    width: 24,
        //    offset: { x: 6, y: 1 },
        //});
        // Stats
        //text.push({ text: health, color: '#FFFFFF', offset: { x: 12, y: 50 } });
        //text.push({ text: '*', color: '#FFFFFF', offset: { x: 0, y: 4 } });

        // Setup the unit
        unit = new Unit({
            type: type,
            actions: type.actions,
            //acted: false,
            //img,
            //text,
            //health,
            //team,
        });

        return unit;
    }
}

export = Unit;
