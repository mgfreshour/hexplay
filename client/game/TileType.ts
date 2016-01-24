import Promise = require('bluebird');
import Renderable = require('../renderer/Renderable');
/// <reference path='../../typings/tsd.d.ts' />
'use strict';

/**
 * Represents the map tile type, contains the initial properties.
 * @class TileType
 * @constructor
 */
class TileType extends Renderable {

    constructor (options) {
        super(options);
    }

    private static data: Map<string, TileType>;

    public static load (data?: Map<string, TileType>): Promise<void> {
        return new Promise<void>(function (resolve, reject) {
            if (data) {
                TileType.data = data;
                return resolve();
            }
            reject(new Error('Not Implemented'));
        });
    }

    public static get (typeIndex: number): TileType {
        return undefined;
    }
}

// Done!!
export = TileType;
