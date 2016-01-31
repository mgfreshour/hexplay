import Promise = require('bluebird');
import Renderable = require('../renderer/Renderable');
import IUnitAction = require('./unitActions/IUnitAction');
import ActionFactory = require('./ActionFactory');
'use strict';

/**
 * Represents the unit type, contains the initial properties.
 * @class UnitType
 * @constructor
 */
class UnitType extends Renderable {
    private static data: Map<string, UnitType>;

    private _name: string;
    public get name () { return this._name; }
    private _actions: Map<string, IUnitAction>;
    public get actions () { return this._actions; }

    /**
     * Loads type data for use.
     * @param {Array<any>} [data] - type setup to load.
     * @returns {Promise<void>} resolving when finished.
     */
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

    /**
     * Gets the type object associated with passed index.
     * @param {String} name - name of type to get.
     * @returns {UnitType} Type with name.
     */
    public static getType (name: string): UnitType {
        return UnitType.data.get(name);
    }

    /**
     * Constructor.
     * @param {Object} options - options to load.
     */
    constructor (options: any) {
        super(options);
        this._name    = options.name;
        this._actions = ActionFactory.createUnitActions(options.actions);
    }
}

// Done!!
export = UnitType;
