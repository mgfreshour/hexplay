import Renderable = require('../renderer/Renderable');
import Promise = require('bluebird');
'use strict';

interface ITerrainModifier {
    defenseBonus: number;
    movementCost: number;
    tileType: string;
}

/**
 * Represents the unit type, contains the initial properties.
 * @class UnitType
 * @constructor
 */
class UnitType extends Renderable {
    private static data: Map<string, UnitType>;

    private _name: string;
    public get name () { return this._name; }
    private _actions: string;
    public get actions () { return this._actions; }
    private _attackRange: number;
    public get attackRange () { return this._attackRange; }
    private _startingHealth: number;
    public get startingHealth () { return this._startingHealth; }
    private _defensePower: number;
    public get defensePower () { return this._defensePower; }
    private _defenseType: string;
    public get defenseType () { return this._defenseType; }
    private _attackPowerSoft: number;
    public get attackPowerSoft () { return this._attackPowerSoft; }
    private _attackPowerHard: number;
    public get attackPowerHard () { return this._attackPowerHard; }
    private _moveRange: number;
    public get moveRange () { return this._moveRange; }
    private _price: number;
    public get price () { return this._price; }
    private _terrainModifiers: Array<ITerrainModifier>;
    public get terrainModifiers () { return this._terrainModifiers; }

    constructor (options) {
        super(options);
        this._name             = options.name;
        this._price            = options.price;
        this._actions          = options.actions;
        this._moveRange        = options.moveRange;
        this._defenseType      = options.defenseType;
        this._attackRange      = options.attackRange;
        this._defensePower     = options.defensePower;
        this._startingHealth   = options.startingHealth;
        this._attackPowerSoft  = options.attackPowerSoft;
        this._attackPowerHard  = options.attackPowerHard;
        this._terrainModifiers = options.terrainModifiers;
    }

    public static load (data?: Array<any>): Promise<void> {
        return new Promise<void>(function (resolve, reject) {
            UnitType.data = new Map<string, UnitType>();
            if (data) {
                _.each(data, (item) => {
                    let type = new UnitType(item);
                    UnitType.data.set(type.name, type);
                });
                return resolve();
            }
            reject(new Error('Load from Server Not Implemented'));
        });
    }

    public static getType (typeIndex: string): UnitType {
        return UnitType.data.get(typeIndex);
    }
}

// Done!!
export = UnitType;
