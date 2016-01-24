'use strict';

/**
 * Definese a class that can draw a Renderable Item.
 * @class IRenderer
 * @interface
 */
class IRenderer {

    /**
     * Adds a drawing layer to the screen.
     * @param {String} layerName  Name of layer to add.
     */
    addLayer (layerName) {
    }

    /**
     * Removes all Renderable Items from a drawing layer.
     * @param {String} layerName  Name of layer to clear.
     */
    clearLayer (layerName) {
    }

    /**
     * Removes all Renderable Items from the screen.
     * @param {String} layerName Name of layer to clear.
     */
    clearScreen (layerName) {
    }

    /**
     * Draws a Renderable Item to a layer.
     * @param {String} layerName Name of layer to add item to.
     * @param {Number} x Screen position to move to.
     * @param {Number} y Screen position to move to.
     * @param {Renderable} item Item to add to layer.
     */
    drawItemToLayer (layerName, x, y, item) {
    }


    /**
     * Moves an already drawn Renderable Item.
     * @param {Number} x Screen position to move to.
     * @param {Number} y Screen position to move to.
     * @param {Renderable} item Item to move.
     */
    moveItem (x, y, item) {
    }

    /**
     * Hides a Renderable Item without destroying it.
     * @param {Renderable} item Item to hide.
     */
    hideItem (item) {
	}

    /**
     * Shows a hidden Renderable Item.
     * @param {Renderable} item Item to show.
     */
    showItem (item) {
	}

    /**
     * Removes a Renderable Item from the screen.
     * @param {Renderable} item Item to remove.
     */
    removeItem (item) {
	}

    /**
     * Removes a Renderable Item from the screen after fading it out.
     * @param {Renderable} item Item to remove.
     * @param {Number} [duration] Milliseconds to take to fade out. Defaults to 500.
     * @param {Number} [delay] Milliseconds to wait before starting fade.  Defaults to 0.
     */
    fadeOutAndRemove (item, duration, delay) {
	}
}

export = IRenderer;
