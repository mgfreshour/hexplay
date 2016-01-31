import Hex = require('../lib/Hex');
import TileType = require('./TileType');
import Renderable = require('../renderer/Renderable');
import ITileAction = require('./tileActions/ITileAction');
'use strict';

/**
 * Represents a single map tile.
 * @class Tile
 * @constructor
 */
class Tile extends Renderable {
    private _type: TileType;
    public get type () { return this._type; }
    private _actions: Map<string, ITileAction>;
    public get actions () { return this._actions; }

    constructor (options) {
        super(options);
        this._type = options.type;

        this._actions = new Map<string, ITileAction>();
        options.actions.forEach((action, name) => this._actions.set(name, _.clone(action)));
    }

    /**
     * Creates a tile based on type.
     * @static
     * @param {string} typeIndex Index (name) of the type to use.
     * @return {Tile} New tile.
     */
    public static createTileForTypeIndex (typeIndex: string) {
        let tile, type = TileType.getType(typeIndex);
        if (!type) {
            throw 'Tile type not found ' + typeIndex;
        }
        tile = new Tile({
            img: {
                src:     type.img,
                x:       type.imgX,
                y:       type.imgY,
                height:  Hex.HEX_HEIGHT,
                width:   Hex.HEX_WIDTH,
            },
            actions: type.actions,
            type: type,
        });

        return tile;
    }
}

export = Tile;
