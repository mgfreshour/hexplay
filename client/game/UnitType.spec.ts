
import UnitType = require('./UnitType');

describe('UnitType', function () {
    describe('::load', function () {
        it('adds passed types to internal structure', function () {
            let data = [
                { name: 'human peasant' },
                { name: 'great holy knight' },
            ];
            return UnitType.load(data)
                .then(function () {
                    expect(UnitType.getType('human peasant').name).toEqual('human peasant');
                    expect(UnitType.getType('great holy knight').name).toEqual('great holy knight');
                });
        });
    });
});
