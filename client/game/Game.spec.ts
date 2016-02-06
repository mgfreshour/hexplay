import GameMap = require('./GameMap');
import TileType = require('./TileType');
import Game = require('./Game');
import UnitType = require('./UnitType');
import Unit = require('./Unit');
//import Hex = require('../lib/Hex');
'use strict';

let map1Data = require('../../test_data/map1.json');
let tileTypesData = require('../../test_data/tile_types.json');


describe('Game', function () {
    let testee: Game, map: GameMap;


    beforeAll(function (done) {
        let data = [
            { name: 'testType', actions: { move: { range: 4 } } },
            { name: 'human peasant', actions: { move: { range: 4 } } },
            { name: 'undead thrall', actions: { move: { range: 4 } } },
        ];
        UnitType.load(data)
            .then(done);
    });

    beforeEach(function (done) {
        // create simple mock tile data.
        TileType.load(tileTypesData)
            .then(function () {
                map = new GameMap({
                    height: 6,
                    width: 7,
                });
                map.createMapTiles(map1Data.tile_data);
                //console.log(Hex.asciiHexmap(testee.map.map((x, y, tile) => tile.type.name)));
                done();
            });
    });

    beforeEach(function () {
        testee = new Game({ map: map });
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

        it('returns current turn', function () {

        });
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
            let unit = testee.createUnit({ x: 3, y: 4, type: 'testType', team: 'green'});
            expect(unit).toEqual(jasmine.any(Unit));
            expect(testee.units.length).toEqual(1);
        });
        it('throws an error if unit is outside of map', function () {
            let x = testee.map.width + 1;
            expect(() => testee.createUnit({ x: x, y: 4, type: 'testType', team: 'green'}))
                .toThrow();
        });
    });

    describe('getUnit', function () {
        it('returns unit on the hex', function () {
            let unit = testee.createUnit({ x: 1, y: 2, type: 'testType', team: 'green' });
            expect(testee.getUnit(1, 2)).toEqual(unit);
        });
        it('returns false when there is no unit on hex', function () {
            console.log(testee.getUnit(3, 4));
            expect(testee.getUnit(3, 4)).toBeFalsy();
        });
    });
});
