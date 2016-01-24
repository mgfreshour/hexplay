import Hex = require('../lib/Hex');
import TileType = require('./TileType');
import Renderable = require('../renderer/Renderable');
'use strict';

/**
 * @class Tile
 * @constructor
 */
class Tile extends Renderable {
    private typeIndex: TileType;

    constructor (options) {
        super(options);
        this.typeIndex = options.typeIndex;
    }

    /**
     * @method createTileForTypeIndex
     * @static
     * @param {Number} typeIndex
     * @return {Tile}
     */
    public static createTileForTypeIndex (typeIndex) {
        let tile, tileType = TileType.get(typeIndex);
        if (!tileType) {
            throw 'Tile type not found ' + typeIndex;
        }
        tile = new Tile({
            img: {
                src:    tileType.img,
                x:      tileType.imgX,
                y:      tileType.imgY,
                height: Hex.HEX_HEIGHT,
                width:  Hex.HEX_WIDTH,
            },
            typeIndex: typeIndex,
        });

        return tile;
    }
}

export = Tile;
