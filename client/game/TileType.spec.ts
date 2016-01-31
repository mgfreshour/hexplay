
import TileType = require('./TileType');
import ShopAction = require('./tileActions/ShopAction');

describe('TileType', function () {
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

        it('creates the actions', function () {
            let data = [
                { name: 'test_tile1', actions: { shop: {} } }
            ];
            return TileType.load(data)
                .then(function () {
                    expect(TileType.getType('test_tile1').actions.get('shop')).toEqual(jasmine.any(ShopAction));
                });
        });
    });
});
