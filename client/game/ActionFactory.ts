import ITileAction = require('./tileActions/ITileAction');
import ShopAction = require('./tileActions/ShopAction');
import IUnitAction = require('./unitActions/IUnitAction');
import MoveAction = require('./unitActions/MoveAction');

'use strict';

/**
 * Responsible for creating action objects.
 */
class ActionFactory {
    /**
     * Create a single unit action object from name with options.
     * @param {string} name - name of the action.
     * @param {any} options - options for the action.
     * @returns {IUnitAction} create action.
     * @throws {Error} if no action matching name is found.
     */
    public static createUnitAction (name, options: any): IUnitAction {
        switch (name) {
            case 'move':
                return new MoveAction(options);
            default:
                throw new Error(`Unknown action name ${name}, check ActionFactory.`);
        }
    }

    /**
     * Creates a map of unit actions based on passed object.
     * @param {{ actionName: options }} actionsObj - hash about what actions to create.
     * @returns {Map<string, IUnitAction>} map of actions.
     */
    public static createUnitActions (actionsObj: any): Map<string, IUnitAction> {
        let ret = new Map<string, IUnitAction>();
        _.each(actionsObj, function (option, name) {
            ret.set(name, ActionFactory.createUnitAction(name, option));
        });

        return ret;
    }

    /**
     * Create a single tile action object from name with options.
     * @param {string} name - name of the action.
     * @param {any} options - options for the action.
     * @returns {ITileAction} create action.
     * @throws {Error} if no action matching name is found.
     */
    public static createTileAction (name, options: any): ITileAction {
        switch (name) {
            case 'shop':
                return new ShopAction(options);
            default:
                throw new Error(`Unknown action name ${name}, check ActionFactory.`);
        }
    }

    /**
     * Creates a map of unit actions based on passed object.
     * @param {{ actionName: options }} actionsObj - hash about what actions to create.
     * @returns {Map<string, IUnitAction>} map of actions.
     */
    public static createTileActions (actionsObj: any): Map<string, ITileAction> {
        let ret = new Map<string, ITileAction>();
        _.each(actionsObj, function (option, name) {
            ret.set(name, ActionFactory.createTileAction(name, option));
        });

        return ret;
    }
}

export = ActionFactory;
