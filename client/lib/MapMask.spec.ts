'use strict';

import MapMask = require('./MapMask');

describe('MapMask', function () {
    let testee;

    beforeEach(function () {
        testee = new MapMask(10, 10);
    });

    describe('constructor', function () {
        it('sets correct size', function () {
            expect(testee.height).toEqual(10);
            expect(testee.width).toEqual(10);
        });

        it('prefills itself with clear by default', function () {
            testee.each((x, y, item) => {
                expect(item).toEqual(MapMask.MaskType.MASK_CLEAR, `${x},${y} = ${item}`);
            });
        });

        it('prefills itself with passed value', function () {
            testee = new MapMask(10, 10, MapMask.MaskType.MASK_RED_OUTLINE);
            testee.each((x, y, item) => {
                expect(item).toEqual(MapMask.MaskType.MASK_RED_OUTLINE, `${x},${y} = ${item}`);
            });
        });
    });

    describe('#renderable', function () {
        it('returns stuff', function () {
            testee = new MapMask(10, 10, MapMask.MaskType.MASK_RED_OUTLINE);
            testee = testee.renderable();
            testee.each((x, y, item) => {
                expect(item.img.src).toEqual('/images/misc/mask-red.png', `${x},${y} = ${item}`);
            });
        });
    });


});
