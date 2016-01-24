'use strict';

require('es6-shim');
import IRenderer = require('./IRenderer');

/// <reference path='../../typings/tsd.d.ts' />

/**
 * Class that handles drawing stuff on the screen.
 * @constructor
 * @implements {IRenderer}
 */
class CreatejsRenderer implements IRenderer {
    private stage: createjs.Stage;
    private layers: Map<string, createjs.Container>;
    private spriteSheets: Map<string, createjs.SpriteSheet>;

    /**
     * Constructor.
     * @param {JQuery} screen HTML element to render to.
     */
    constructor (screen: JQuery) {
        let stage = new createjs.Stage(screen.attr('id'));
        /**
         * Main Stage
         * @type {createjs.Stage}
         */
        this.stage = stage;
        this.layers = new Map<string, createjs.Container>();
        this.spriteSheets = new Map<string, createjs.SpriteSheet>();

        createjs.Ticker.addEventListener('tick', stage);
    };

    /* tslint:disable:valid-jsdoc */
    /**
     * @inheritDoc
     */
    public drawItemToLayer (layerName, x, y, item) {
        let layer = this._getLayer(layerName);
        this._drawItem(item, layer, x, y);
    };

    /**
     * @inheritDoc
     */
    public moveItem (x, y, item) {
        if (item.gfxContainer) {
            createjs.Tween.get(item.gfxContainer).to({ x: x, y: y }, 300, createjs.Ease.getBackInOut(1));
        } else {
            throw 'Cannot move item not yet drawn!';
        }
    };

    /**
     * @inheritDoc
     */
    public hideItem (item) {
        if (item.gfxContainer) {
            item.gfxContainer.visible = false;
        }
    };

    /**
     * @inheritDoc
     */
    public showItem (item) {
        if (item.gfxContainer) {
            item.gfxContainer.visible = true;
        }
    };

    /**
     * @inheritDoc
     */
    public removeItem (item) {
        if (item.gfxContainer) {
            item.gfxContainer.parent.removeChild(item.gfxContainer);
        }
    };

    /**
     * @inheritDoc
     */
    public addLayer (layerName) {
        let container = new createjs.Container();
        this.layers[layerName] = container;
        this.stage.addChild(container);
    };

    /**
     * @inheritDoc
     */
    public clearLayer (layerName) {
        if (this.layers[layerName] !== undefined) {
            this.layers[layerName].removeAllChildren();
        }
    };

    /**
     * @inheritDoc
     */
    public clearScreen (layerName) {
        $.each(this.layers, function (key) {
            this.clearLayer(key);
        }.bind(this));
    };

    /**
     * @inheritDoc
     */
    public fadeOutAndRemove (item, duration, delay) {
        let _this = this;
        delay = delay !== undefined ? delay : 0;
        duration = duration !== undefined ? duration : 500;
        if (item.gfxContainer) {
            createjs.Tween.get(item.gfxContainer)
                .wait(delay)
                .to({ alpha: 0 }, duration)
                .call(function () { _this.removeItem(item); });
        }
    };
    /* tslint:enable:valid-jsdoc */

    /**
     * Gets or creates a layer of name.
     * @private
     * @param {String} layerName Name of layer to draw to.
     * @return {JQuery} HTML node layer.
     */
    private _getLayer (layerName): JQuery {
        if (this.layers[layerName] === undefined) {
            this.addLayer(layerName);
        }

        return this.layers[layerName];
    };

    /**
     * Draw a Renderable Item to the screen.
     * @private
     * @param {Renderable} item Object to draw.
     * @param {createjs.Container} container the item to draw into.
     * @param {Number} screenX Position to draw.
     * @param {Number} screenY Position to draw.
     * @param {Boolean} [forceRedraw] Force new graphics container to be made for item.
     */
    private _drawItem (item, container, screenX, screenY, forceRedraw?) {
        if (item.gfxContainer && !forceRedraw) {
            // Just move it
            item.gfxContainer.x = screenX;
            item.gfxContainer.y = screenY;
        } else {
            // --- Style values to position hex image in the right location
            let n = 0,
                img = item.get('img'),
                text = item.get('text');

            // Only add the element if there are actual drawables
            if (img || text) {

                item.gfxContainer = new createjs.Container();

                // Draw the images
                if (img) {
                    if ($.isArray(img)) {
                        for (n = 0; n < img.length; n++) {
                            img[n].gfxContainer = this._createImageSprite(img[n].src, item.gfxContainer,
                                img[n].x, img[n].y, img[n].height, img[n].width,
                                img[n].offset || {});

                        }
                    } else {
                        img.gfxContainer = this._createImageSprite(img.src, item.gfxContainer, img.x, img.y,
                            img.height, img.width, img.offset || {});
                    }
                }

                // Draw the text
                if (text) {
                    if ($.isArray(text)) {
                        for (n = 0; n < text.length; n++) {
                            text[n].gfxContainer = this._createTextSprite(text[n].text, text[n].color, text[n].offset,
                                item.gfxContainer, text[n].font);
                        }
                    } else {
                        text.gfxContainer = this._createTextSprite(text.text, text.color, text.offset,
                            item.gfxContainer, text.font);
                    }
                }

                // Flip the buffer... sort of :P
                item.gfxContainer.x = screenX;
                item.gfxContainer.y = screenY;
                container.addChild(item.gfxContainer);
            }
        }
    };

    /**
     * Draws an image to the screen as a BG image on a div.
     * @private
     * @param {String} imgSrc URL for image.
     * @param {createjs.Container} parentContainer where to add elements
     * @param {Number} imgX Position in the background image to start drawing from.
     * @param {Number} imgY Position in the background image to start drawing from.
     * @param {Number} height Size of sprite.
     * @param {Number} width Size of sprite.
     * @param {{x,y}} offset Offset into sprite sheet.
     * @returns {createjs.Sprite} sprite created.
     */
    private _createImageSprite (imgSrc, parentContainer, imgX, imgY,
                                height, width, offset) {
        // Create the graphic container
        let spriteSheet = this._getSpriteSheet(imgSrc, imgX, imgY, height, width);
        let sprite = new createjs.Sprite(spriteSheet, 'idle');
        sprite.x = offset.x || 0;
        sprite.y = offset.y || 0;
        parentContainer.addChild(sprite);
        return sprite;
    };

    /**
     * Creates or retrieves a sprite sheet.
     * @private
     * @param {String} imgSrc URL for image.
     * @param {Number} imgX Position in the background image to start drawing from.
     * @param {Number} imgY Position in the background image to start drawing from.
     * @param {Number} height Size of sprite.
     * @param {Number} width Size of sprite.
     * @returns {createjs.SpriteSheet} The sprite sheet.
     */
    private _getSpriteSheet (imgSrc, imgX, imgY, height, width): createjs.SpriteSheet {
        let key = imgSrc + ',' + imgX + ',' + imgY + ',' + height + ',' + width;
        if (!this.spriteSheets[key]) {
            let data = {
                images: [ imgSrc ],
                frames: [
                    // x, y, width, height, imageIndex, regX, regY
                    [ imgX, imgY, height, width, 0 ]
                ],
                animations: { idle: [0, 0] },
            };
            this.spriteSheets[key] = new createjs.SpriteSheet(data);
        }
        return this.spriteSheets[key];
    };


    /**
     * Draws an image to the screen as a BG image on a div.
     * @private
     * @param {String} text Words to use.
     * @param {String} color Color of the text.
     * @param {{x,y}} offset Offset to start drawing in sprite space.
     * @param {createjs.Container} parentContainer where to add elements
     * @param {String} font Style for text.
     * @returns {createjs.Text} gfx sprite created.
     */
    private _createTextSprite (text, color, offset, parentContainer, font) {
        let textSprite = new createjs.Text(text, font || '20px Arial', color || '#FFFFFF');
        textSprite.x = offset.x || 0;
        textSprite.y = offset.y || 0;
        parentContainer.addChild(textSprite);
        return textSprite;
    };
}


