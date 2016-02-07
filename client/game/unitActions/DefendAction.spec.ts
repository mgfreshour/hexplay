import GameFactory = require('../GameFactory');
import DefendAction = require('./DefendAction');
import MapMask = require('../../lib/MapMask');
'use strict';

describe('DefendAction', function () {
    let testee: DefendAction;
    let game, map, unit, mask;

    beforeEach(function () {
        return GameFactory.newTestGame().then(function (newGame) {
            map = newGame.map;
            game = newGame;
            mask = new MapMask(map.height, map.width);
            testee = new DefendAction({ range: 4, terrainCosts: { grass: 1 } });
            unit = game.createUnit({ x: 2, y: 3, type: 'undead thrall', team: 'green'});
        });
    });


    describe('getOptions', function () {
        it('returns nothing', function () {
            expect(testee.getOptions(game, unit)).toEqual([]);
        });
    });

    describe('updateMask', function () {
        it('returns mask untouched', function () {
            expect(testee.updateMask(game, unit, mask)).toEqual(mask);
        });
    });

    describe('canPerform', function () {
        it('always returns false', function () {
            expect(testee.canPerform(game, unit)).toEqual(false);
        });
    });

    describe('perform', function () {
        it('.... umm... I don`t know...');
    });
});
