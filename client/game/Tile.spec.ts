
import Tile = require('./Tile');
import TileType = require('./TileType');
import ShopAction = require('./tileActions/ShopAction');


describe('Tile', function () {
    beforeAll(function (done) {
        let data = [
            { name: 'test_type1' },
            { name: 'test_type2', actions: { shop: {} } },
        ];
        return TileType.load(data).then(done);
    });

    describe('createTileForTypeIndex', function () {
        it('should create the desired tile', function () {
            let testee = Tile.createTileForTypeIndex('test_type1');
            expect(testee.type.name).toEqual('test_type1');
        });

        it('should copy the actions', function () {
            let testee = Tile.createTileForTypeIndex('test_type2');
            expect(testee.type.actions.get('shop')).toEqual(jasmine.any(ShopAction), 'type');
            expect(testee.actions.get('shop')).toEqual(jasmine.any(ShopAction), 'tile');
        });
    });
});
