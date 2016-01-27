'use strict';

import IUnitAction = require('./IUnitAction');
import MoveAction = require('./MoveAction');

/**
 * Responsible for creating action objects.
 */
class ActionFactory {
    /**
     * Create a single action object from name with options.
     * @param {string} name - name of the action.
     * @param {any} options - options for the action.
     * @returns {IUnitAction} create action.
     * @throws {Error} if no action matching name is found.
     */
    public static createAction (name, options: any): IUnitAction {
        switch (name) {
            case 'move':
                return new MoveAction(options);
            default:
                throw new Error(`Unknown action name ${name}, check ActionFactory.`);
        }
    }

    /**
     * Creates a map of actions based on passed object.
     * @param {{ actionName: options }} actionsObj - hash about what actions to create.
     * @returns {Map<string, IUnitAction>} map of actions.
     */
    public static createActions (actionsObj: any): Map<string, IUnitAction> {
        let ret = new Map<string, IUnitAction>();
        _.each(actionsObj, function (option, name) {
            ret.set(name, ActionFactory.createAction(name, option));
        });

        return ret;
    }
}

export = ActionFactory;
