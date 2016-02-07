import GameFactory = require('./GameFactory');
import Game = require('./Game');
import Unit = require('./Unit');
//import Hex = require('../lib/Hex');
'use strict';

let map1Data = require('../../test_data/map1.json');


describe('Game', function () {
    let testee: Game;

    beforeEach(function () {
        return GameFactory.newTestGame().then(function (game) {
            testee = game;
        });
    });

    describe('loadPlayers', function () {
        it('sets the internal players');
        it('assigns the teams');
        it('limits teams to what is allowed in map');
    });

    describe('loadTurns', function () {
        beforeEach(function () {
            //testee.turns
        });

        it('returns current turn');
    });

    describe('loadUnits', function () {
        it('should have units loaded after load', function () {
            testee.loadUnits(map1Data.unitData);
            map1Data.unitData.forEach(function (unit) {
                expect(testee.getUnit(unit.x, unit.y).team).toEqual(unit.team);
                expect(testee.getUnit(unit.x, unit.y).type.name).toEqual(unit.type);
            });
        });
    });

    describe('getAllowedActions', function () {
        it('returns actions of tile', function () {
            expect(testee.getAllowedActions({ x: 1, y: 5 })).toContain('shop');
        });

        xit('returns actions from unit', function () {
            expect(testee.getAllowedActions({ x: 2, y: 2 })).toContain('move');
        });
    });

    describe('createUnit', function () {
        it('adds the requested unit', function () {
            let unit = testee.createUnit({ x: 3, y: 4, type: 'undead thrall', team: 'green'});
            expect(unit).toEqual(jasmine.any(Unit));
            expect(testee.units.length).toEqual(1);
        });
        it('throws an error if unit is outside of map', function () {
            let x = testee.map.width + 1;
            expect(() => testee.createUnit({ x: x, y: 4, type: 'undead thrall', team: 'green'}))
                .toThrow();
        });
    });

    describe('getUnit', function () {
        it('returns unit on the hex', function () {
            let unit = testee.createUnit({ x: 1, y: 2, type: 'undead thrall', team: 'green' });
            expect(testee.getUnit(1, 2)).toEqual(unit);
        });
        it('returns false when there is no unit on hex', function () {
            console.log(testee.getUnit(3, 4));
            expect(testee.getUnit(3, 4)).toBeFalsy();
        });
    });
});
