'use strict';

var Hex = require('./Hex');
var Array2d = require('./Array2d');

describe('utils.Hex', function () {

    describe('::getAdjacentCoords', function () {
        it('works from the middle', function () {
            var height = 4, width = 4, actual;
            var expected = [
                {x: 2, y: 1},
                {x: 2, y: 2},
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 0, y: 1},
                {x: 0, y: 2},
            ];
            actual = Hex.getAdjacentCoords(1, 1, height, width);
            expect(actual.length).toEqual(expected.length);
            expect(actual).toEqual(expected);
        });

        it('works from the edge', function () {
            var height = 4, width = 4, actual;
            var expected = [
                {x: 2, y: 0},
                {x: 2, y: 1},
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 0, y: 0},
                {x: 0, y: 1},
            ];
            actual = Hex.getAdjacentCoords(1, 0, height, width);
            expect(actual.length).toEqual(expected.length);
            expect(actual).toEqual(expected);
        });

        it('works from the corner', function () {
            var height = 4, width = 4, actual;
            var expected = [
                {x: 1, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 1},
            ];
            actual = Hex.getAdjacentCoords(0, 0, height, width);
            expect(actual.length).toEqual(expected.length);
            expect(actual).toEqual(expected);
        });
    });

    describe('::walkAdjacent', function () {
        it('works from corner', function () {
            var height = 5, width = 5;
            var expected = [
                [1, 1, 2, 3, 4],
                [1, 2, 2, 3, 4],
                [2, 3, 3, 4, 4],
                [3, 4, 4, 5, 5],
                [4, 5, 5, 6, 6],
            ];
            var testValues = new Array2d(height, width, 'h');
            var maxDepth = 6;
            var callback = function (x, y, currentDepth) {
                if (testValues.get(x, y) === 'h' || testValues.get(x, y) > currentDepth) {
                    testValues.set(x, y, currentDepth);
                }
            };
            Hex.walkAdjacent(0, 0, maxDepth, callback, height, width);
            expect(testValues.data).toEqual(expected);
        });
    });

});


