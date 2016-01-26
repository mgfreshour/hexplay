import Hex = require('../lib/Hex');
import TileType = require('./TileType');
import Renderable = require('../renderer/Renderable');
'use strict';

/**
 * @class Tile
 * @constructor
 */
class Tile extends Renderable {
    private _type: TileType;
    public get type () { return this._type; }

    constructor (options) {
        super(options);
        this._type = options.type;
    }

    /**
     * @method createTileForTypeIndex
     * @static
     * @param {string} typeIndex
     * @return {Tile}
     */
    public static createTileForTypeIndex (typeIndex: string) {
        let tile, type = TileType.getType(typeIndex);
        if (!type) {
            throw 'Tile type not found ' + typeIndex;
        }
        tile = new Tile({
            img: {
                src:    type.img,
                x:      type.imgX,
                y:      type.imgY,
                height: Hex.HEX_HEIGHT,
                width:  Hex.HEX_WIDTH,
            },
            type: type,
        });

        return tile;
    }
}

export = Tile;
