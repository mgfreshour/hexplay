'use strict';

import Hex = require('./Hex');
import Array2d = require('./Array2d');

describe('utils.Hex', function () {

    describe('::getAdjacentCoords', function () {
        it('works from the middle', function () {
            let height = 4, width = 4, actual;
            let expected = [
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
            let height = 4, width = 4, actual;
            let expected = [
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
            let height = 4, width = 4, actual;
            let expected = [
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
            let height = 5, width = 5;
            let expected = [
                [1, 1, 2, 3, 4],
                [1, 2, 2, 3, 4],
                [2, 3, 3, 4, 4],
                [3, 4, 4, 5, 5],
                [4, 5, 5, 6, 6],
            ];
            let testValues = new Array2d(height, width, 'h');
            let maxDepth = 6;
            let callback = function (x, y, currentDepth) {
                if (testValues.get(x, y) === 'h' || testValues.get(x, y) > currentDepth) {
                    testValues.set(x, y, currentDepth);
                }
            };
            Hex.walkAdjacent(0, 0, maxDepth, callback, height, width);
            expect(testValues.getInternalData()).toEqual(expected);
        });
    });

    describe('asciiHexmap', function () {
        xit('draws one hex', function () {
            let testee = new Array2d<string>(1, 1, 'Red');
            let actual = Hex.asciiHexmap(testee);
            let expected = [
                '  _____ ',
                ' /     \\ ',
                '/  XXX  \\',
                '\\  YYY  /',
                ' \\_____/ ',
                '         ',
            ].join('\n');
            expect(actual).toEqual(expected);
        });

        xit('draws 2x2 hexes', function () {
            let testee = new Array2d<string>(2, 2, 'Red');
            let actual = Hex.asciiHexmap(testee);
            let expected = [
                '  _____ ',
                ' /     \\ ',
                '/  XXX  \\',
                '\\  YYY  /',
                ' \\_____/ ',
                '         ',
            ].join('\n');
            expect(actual).toEqual(expected);
        });

        xit('draws 6x7 hexes', function () {
            let testee = new Array2d<string>(6, 6, 'Red');
            let actual = Hex.asciiHexmap(testee);
            let expected = [
                '  _____ ',
                ' /     \\ ',
                '/  XXX  \\',
                '\\  YYY  /',
                ' \\_____/ ',
                '         ',
            ].join('\n');
            expect(actual).toEqual(expected);
        });
    });

});


