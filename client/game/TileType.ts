import Promise = require('bluebird');
import Renderable = require('../renderer/Renderable');
import _ = require('lodash');
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

    constructor (options) {
        super(options);
        this._name = options.name;
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
