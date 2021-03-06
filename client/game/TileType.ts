import _ = require('lodash');
import Promise = require('bluebird');
import Renderable = require('../renderer/Renderable');
import ITileAction = require('./tileActions/ITileAction');
import ActionFactory = require('./ActionFactory');
/// <reference path='../../typings/tsd.d.ts' />
'use strict';

/**
 * Represents the map tile type, contains the initial properties.
 * @class UnitType
 * @constructor
 */
class TileType extends Renderable {
    private static data: Map<string, TileType>;

    private _name: string;
    public get name () { return this._name; }
    private _actions: Map<string, ITileAction>;
    public get actions () { return this._actions; }
    //private _ownable: boolean;
    //public get ownable () { return this.ownable; }

    constructor (options) {
        super(options);
        this._name = options.name;

        this._actions = ActionFactory.createTileActions(options.actions);
    }

    public static load (data?: Array<any>): Promise<void> {
        return new Promise<void>(function (resolve, reject) {
            TileType.data = new Map<string, TileType>();
            if (data) {
                _.each(data, (item) => {
                    let type = new TileType(item);
                    TileType.data.set(type.name, type);
                });
                return resolve();
            }
            reject(new Error('Load from Server Not Implemented'));
        });
    }

    public static getType (typeIndex: string): TileType {
        return TileType.data.get(typeIndex);
    }
}

// Done!!
export = TileType;
