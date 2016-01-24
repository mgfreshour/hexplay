'use strict';


/**
 * Class that handles drawing stuff on the screen.
 * @constructor
 * @implements {IRenderer}
 * @param {jQuery} screen the main container to render to
 */
var jQueryRenderer = function (screen) {
    this.screen = screen;
    this.layers = {};
};

/**
 * @inheritDoc
 */
jQueryRenderer.prototype.drawItemToLayer = function (layer_name, x, y, item) {
    var layer = this._getLayer(layer_name);
    this._drawItem(item, layer, x, y);
};

/**
 * @inheritDoc
 */
jQueryRenderer.prototype.hideItem = function (item) {
    if (item.gfxContainer) {
        item.gfxContainer.hide();
    }
};

/**
 * @inheritDoc
 */
jQueryRenderer.prototype.showItem = function (item) {
    if (item.gfxContainer) {
        item.gfxContainer.show();
    }
};

/**
 * @inheritDoc
 */
jQueryRenderer.prototype.removeItem = function (item) {
    if (item.gfxContainer) {
        item.gfxContainer.remove();
    }
};

/**
 * @inheritDoc
 */
jQueryRenderer.prototype.addLayer = function (layer_name) {
    this.layers[layer_name] = $('<div id="rendering_layer_' + layer_name + '" class="rendering_layer"></div>');
    this.screen.append(this.layers[layer_name]);
};

/**
 * @inheritDoc
 */
jQueryRenderer.prototype.clearLayer = function (layer_name) {
    if (this.layers[layer_name] !== undefined) {
        this.layers[layer_name].html('');
    }
};

/**
 * @inheritDoc
 */
jQueryRenderer.prototype.clearScreen = function (layer_name) {
    $.each(this.layers, function (key) {
        this.clearLayer(key);
    }.bind(this));
};

/**
 * @inheritDoc
 */
jQueryRenderer.prototype.fadeOutAndRemove = function (item, duration, delay) {
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
 * @param {String} layer_name
 * @return {jQuery}
 */
jQueryRenderer.prototype._getLayer = function (layer_name) {
    if (this.layers[layer_name] === undefined) {
        this.addLayer(layer_name);
    }

    return this.layers[layer_name];
};

/**
 * Draw a RenderableItem to the screen
 * @private
 * @param {Renderable} item
 * @param {jQuery} container the jquery item to draw into
 * @param {Number} screen_x
 * @param {Number} screen_y
 * @param {Boolean} [force_redraw]
 */
jQueryRenderer.prototype._drawItem = function (item, container, screen_x, screen_y, force_redraw) {
    if (item.gfxContainer && !force_redraw) {
        item.gfxContainer.animate({left: screen_x, top: screen_y}, 100);
    } else {
        // --- Style values to position hex image in the right location
        var pos_style = 'left:' + Math.round(screen_x) + 'px; top:' + Math.round(screen_y) + 'px;',
            n = 0,
            css_class = item.get('gfxCssClass'),
            img = item.get('img'),
            text = item.get('text');

        // Only add teh element if there are actual drawables
        if (img || text) {

            // Create the graphic container
            item.gfxContainer = $('<div style="' + pos_style + '" class="' + css_class + '"></div>');


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
 * @param {String} img_src
 * @param {jQuery} container where to add elements
 * @param {Number} [img_x] the position in the background image to start drawing from
 * @param {Number} [img_y] the position in the background image to start drawing from
 * @return {jQuery} the jquery element that now represents the image
 */
jQueryRenderer.prototype._createImageSprite = function (img_src, container, img_x, img_y) {
    var bg_pos = '';

    if (img_x !== undefined && img_y !== undefined) {
        bg_pos = img_x + 'px ' + img_y * -1 + 'px';
    }
    var img = $('<div alt="" class="img" style="background: url(' + img_src + ') ' +
        bg_pos + ' no-repeat;"></div>');
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
jQueryRenderer.prototype._drawText = function (text, container, css_class) {
    var div = $('<div class="' + css_class + '">' + text + '</div>');
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
//        var pos_style = '',
//            bg_pos = '';
//        if (screen_x !== undefined && screen_y !== undefined) {
//            pos_style = 'left:' + Math.round(screen_x) + 'px; top:' + Math.round(screen_y) + 'px;';
//        }
//        var img = $('<img src="' + img_src + '" alt="" class="img" style="' + pos_style + '" />');
//        //var images = $('<images src="'+img_src+'" alt="" style="'+pos_style+'" />');
//        container.append(img);
//        return img;
//    };

module.exports = jQueryRenderer;
