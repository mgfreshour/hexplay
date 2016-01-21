'use strict';

var Array2d = require('./Array2d.js');

describe('utils.Array2d', function () {
    var testee;

    beforeEach(function () {
        testee = new Array2d();
    });

    describe('#constructor', function () {
        it('should not die horribly', function () {
            expect(testee).toBeDefined();
            expect(testee).not.toBeNull();
        });

        it('should set height and width', function () {
            var height = 6, width = 5;
            testee = new Array2d(height, width);
            expect(testee.getHeight()).toEqual(height);
            expect(testee.getWidth()).toEqual(width);
        });
    });

    describe('#generate', function () {
        it('should create with passed sizes', function () {
            var height = 6, width = 5, y;
            testee.generate(height, width);
            expect(testee.data.length).toEqual(height, 'Correct height');
            for (y = 0; y < testee.data.length; y++) {
                expect(testee.data[y].length).toEqual(width, 'Correct width');
            }
        });

        it('should fill with the passed data', function () {
            var height = 6, width = 5, fill = 'hello', x, y;
            testee.generate(height, width, fill);
            for (y = 0; y < testee.data.length; y++) {
                for (x = 0; x < testee.data[0].length; x++) {
                    expect(testee.data[y][x]).toEqual('hello', '(' + x + ',' + y + ')');
                }
            }
        });
    });

    describe('#each', function () {
        it('iterates through correct number of items', function () {
            var height = 6, width = 5, cnt = 0;
            testee.generate(height, width);
            testee.each(() => cnt++);
            expect(cnt).toEqual(height * width);
        });

        it('passes correct value to callback', function () {
            var height = 6, width = 5,
                x, y;
            testee.generate(height, width);
            for (y = 0; y < testee.data.length; y++) {
                for (x = 0; x < testee.data[0].length; x++) {
                    testee.data[y][x] = x + ',' + y;
                }
            }
            testee.each((x, y, item) => expect(item).toEqual(x + ',' + y));
        });
    });

    describe('#map', function () {
        it('changes cells', function () {
            var height = 6, width = 5,
                x, y;
            testee.generate(height, width);
            testee.map((x, y) => x + ',' + y);
            for (y = 0; y < testee.data.length; y++) {
                for (x = 0; x < testee.data[0].length; x++) {
                    expect(testee.data[y][x]).toEqual(x + ',' + y);
                }
            }
        });
    }); // descibe('#map', function () {

    describe('#setMulti', function () {
        it('works', function () {
            var height = 5, width = 6, x, y;
            var testee = new Array2d(height, width);
            var coords = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 } ];
            testee.setMulti(coords, 'hello');
            for (y = 0; y < testee.data.length; y++) {
                for (x = 0; x < testee.data[0].length; x++) {
                    if (x === y && (y === 0 || y === 1 || y === 2)) {
                        expect(testee.data[y][x]).toEqual('hello',  '(' + x + ',' + y + ')');
                    } else {
                        expect(testee.data[y][x]).toEqual(0,  '(' + x + ',' + y + ')');
                    }
                }
            }
        });
    });

    describe('#set', function () {
        it('works', function () {
            var height = 5, width = 6, x, y;
            testee = new Array2d(height, width);
            testee.set(0, 0, 'hello');
            testee.set(1, 1, 'hello');
            testee.set(2, 2, 'hello');
            for (y = 0; y < testee.data.length; y++) {
                for (x = 0; x < testee.data[0].length; x++) {
                    if (x === y && (y === 0 || y === 1 || y === 2)) {
                        expect(testee.data[y][x]).toEqual('hello',  '(' + x + ',' + y + ')');
                    } else {
                        expect(testee.data[y][x]).toEqual(0,  '(' + x + ',' + y + ')');
                    }
                }
            }
        });

        it('emits event on change', function (done) {
            var height = 5, width = 6, events = [];
            testee = new Array2d(height, width);
            testee.addListener('change', function (x, y, value, old) {
                expect([x, y, value, old]).toEqual([1, 2, 'hello', 0]);
                done();
            });
            testee.set(1, 2, 'hello');
        });
    });


    describe('#get', function () {
        it('works', function () {
            var height = 5, width = 6, x, y;
            testee = new Array2d(height, width);
            testee.data[0][0] = 'hello';
            testee.data[1][1] = 'hello';
            testee.data[2][2] = 'hello';
            for (y = 0; y < testee.data.length; y++) {
                for (x = 0; x < testee.data[0].length; x++) {
                    if (x === y && (y === 0 || y === 1 || y === 2)) {
                        expect(testee.get(x, y)).toEqual('hello',  '(' + x + ',' + y + ')');
                    } else {
                        expect(testee.get(x, y)).toEqual(0, '(' + x + ',' + y + ')');
                    }
                }
            }
        });
    });

    describe('#toString', function () {
        it('works', function () {
            var height = 3, width = 3;
            testee = new Array2d(height, width);
            var expected = '[9][0][0]\n[0][9][0]\n[0][0][9]\n';
            testee.data[0][0] = 9;
            testee.data[1][1] = 9;
            testee.data[2][2] = 9;
            expect(testee.toString()).toEqual(expected);
        });
    });

});

