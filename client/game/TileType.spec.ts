
import TileType = require('./TileType');

describe('UnitType', function () {
    describe('::load', function () {
        it('adds passed types to internal structure', function () {
            let data = [
                { name: 'test_tile1' },
                { name: 'test_tile2' },
            ];
            return TileType.load(data)
                .then(function () {
                    expect(TileType.getType('test_tile1').name).toEqual('test_tile1');
                    expect(TileType.getType('test_tile2').name).toEqual('test_tile2');
                });
        });
    });
});
