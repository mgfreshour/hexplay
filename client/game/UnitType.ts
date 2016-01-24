import Renderable = require('../renderer/Renderable');
import Promise = require('bluebird');
'use strict';

/**
 * Represents the unit type, contains the initial properties.
 * @class TileType
 * @constructor
 */
class UnitType extends Renderable {
    //private urlRoot: string = '/unit_types';
    public startingHealth: number;

    constructor () {
        super();
    }

    public static load (): Promise<void> {
        return new Promise<void>(function (resolve, reject) {
            resolve();
        });
    }

    public static get (typeIndex: number): UnitType {
        return undefined;
    }
}

// Done!!
export = UnitType;
