/* tslint:disable */ // TODO fix this file, or delete it.
'use strict';


/**
 * Class that handles drawing stuff on the screen.
 * @constructor
 * @implements {IRenderer}
 * @param {jQuery} screen the main container to render to
 */
let JQueryRenderer = function (screen) {
    this.screen = screen;
    this.layers = {};
};

/**
 * @inheritDoc
 */
JQueryRenderer.prototype.drawItemToLayer = function (layerName, x, y, item) {
    let layer = this._getLayer(layerName);
    this._drawItem(item, layer, x, y);
};

/**
 * @inheritDoc
 */
JQueryRenderer.prototype.hideItem = function (item) {
    if (item.gfxContainer) {
        item.gfxContainer.hide();
    }
};

/**
 * @inheritDoc
 */
JQueryRenderer.prototype.showItem = function (item) {
    if (item.gfxContainer) {
        item.gfxContainer.show();
    }
};

/**
 * @inheritDoc
 */
JQueryRenderer.prototype.removeItem = function (item) {
    if (item.gfxContainer) {
        item.gfxContainer.remove();
    }
};

/**
 * @inheritDoc
 */
JQueryRenderer.prototype.addLayer = function (layerName) {
    this.layers[layerName] = $('<div id="rendering_layer_' + layerName + '" class="rendering_layer"></div>');
    this.screen.append(this.layers[layerName]);
};

/**
 * @inheritDoc
 */
JQueryRenderer.prototype.clearLayer = function (layerName) {
    if (this.layers[layerName] !== undefined) {
        this.layers[layerName].html('');
    }
};

/**
 * @inheritDoc
 */
JQueryRenderer.prototype.clearScreen = function (layerName) {
    $.each(this.layers, function (key) {
        this.clearLayer(key);
    }.bind(this));
};

/**
 * @inheritDoc
 */
JQueryRenderer.prototype.fadeOutAndRemove = function (item, duration, delay) {
    delay = delay !== undefined ? delay : 0;
    duration = duration !== undefined ? duration : 500;
    if (item.gfxContainer) {
        item.gfxContainer.delay(delay).fadeOut(duration, function () {
            $(this).remove();
        });
    }
};

/**
 * Gets or creates a layer of name
 * @private
 * @param {String} layerName
 * @return {jQuery}
 */
JQueryRenderer.prototype._getLayer = function (layerName) {
    if (this.layers[layerName] === undefined) {
        this.addLayer(layerName);
    }

    return this.layers[layerName];
};

/**
 * Draw a RenderableItem to the screen
 * @private
 * @param {Renderable} item
 * @param {jQuery} container the jquery item to draw into
 * @param {Number} screenX
 * @param {Number} screenY
 * @param {Boolean} [forceRedraw]
 */
JQueryRenderer.prototype._drawItem = function (item, container, screenX, screenY, forceRedraw?) {
    if (item.gfxContainer && !forceRedraw) {
        item.gfxContainer.animate({left: screenX, top: screenY}, 100);
    } else {
        // --- Style values to position hex image in the right location
        let posStyle = 'left:' + Math.round(screenX) + 'px; top:' + Math.round(screenY) + 'px;',
            n = 0,
            cssClass = item.get('gfxCssClass'),
            img = item.get('img'),
            text = item.get('text');

        // Only add teh element if there are actual drawables
        if (img || text) {

            // Create the graphic container
            item.gfxContainer = $('<div style="' + posStyle + '" class="' + cssClass + '"></div>');


            // Draw the images
            if (img) {
                if ($.isArray(img)) {
                    for (n = 0; n < img.length; n++) {
                        this._createImageSprite(img[n].src, item.gfxContainer, img[n].x, img[n].y);
                    }
                } else {
                    this._createImageSprite(img.src, item.gfxContainer, img.x, img.y);
                }
            }

            // Draw the text
            if (text) {
                if ($.isArray(text)) {
                    for (n = 0; n < text.length; n++) {
                        this._drawText(text[n].text, item.gfxContainer, text[n].css_class);
                    }
                } else {
                    this._drawText(text.text, item.gfxContainer, text.css_class);
                }
            }


            // Flip the buffer... sort of :P
            container.append(item.gfxContainer);
        }
    }
};

/**
 * Draws an image to the screen as a BG image on a div
 * @private
 * @param {String} imgSrc
 * @param {jQuery} container where to add elements
 * @param {Number} [imgX] the position in the background image to start drawing from
 * @param {Number} [imgY] the position in the background image to start drawing from
 * @return {jQuery} the jquery element that now represents the image
 */
JQueryRenderer.prototype._createImageSprite = function (imgSrc, container, imgX?, imgY?) {
    let bgPos = '';

    if (imgX !== undefined && imgY !== undefined) {
        bgPos = imgX + 'px ' + imgY * -1 + 'px';
    }
    let img = $('<div alt="" class="img" style="background: url(' + imgSrc + ') ' +
        bgPos + ' no-repeat;"></div>');
    container.append(img);
    return img;
};



/**
 * Draws an image to the screen as a BG image on a div
 * @private
 * @param {String} text
 * @param {jQuery} container where to add elements
 * @param {String} css_class the CSS class to apply to element
 * @return {jQuery} the jquery element that now represents the image
 */
JQueryRenderer.prototype._drawText = function (text, container, css_class) {
    let div = $('<div class="' + css_class + '">' + text + '</div>');
    container.append(div);
    return div;
};

/**
 * Draws an image to the screen as a BG image on a div
 * @private
 * @param {String} img_src
 * @param {jQuery} container where to add elements
 * @param {Number} [screen_x]
 * @param {Number} [screen_y]
 * @return {jQuery} the jquery element that now represents the image
 */
//    jQueryRenderer.prototype._drawImg = function (img_src, container, screen_x, screen_y) {
//        let pos_style = '',
//            bg_pos = '';
//        if (screen_x !== undefined && screen_y !== undefined) {
//            pos_style = 'left:' + Math.round(screen_x) + 'px; top:' + Math.round(screen_y) + 'px;';
//        }
//        let img = $('<img src="' + img_src + '" alt="" class="img" style="' + pos_style + '" />');
//        //let images = $('<images src="'+img_src+'" alt="" style="'+pos_style+'" />');
//        container.append(img);
//        return img;
//    };

export = JQueryRenderer;
