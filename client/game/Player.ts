import assert = require('assert');
'use strict';

class Player {
    private _team: string;
    public get team () { return this._team; }

    constructor (options) {
        this._team = options.team;
        assert(this._team, 'Team required');
    }
}

export = Player;
