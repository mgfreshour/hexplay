import Renderable = require('../renderer/Renderable');
import Promise = require('bluebird');
'use strict';

/**
 * Represents the map tile type, contains the initial properties.
 * @class TileType
 * @constructor
 */
class TileType extends Renderable {
    constructor () {
        super();
    }

    public static load (): Promise<void> {
        return new Promise<void>(function (resolve, reject) {
            resolve();
        });
    }

    public static get (typeIndex: number): TileType {
        return undefined;
    }
}

// Done!!
export = TileType;
