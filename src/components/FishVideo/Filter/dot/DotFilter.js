var glslify  = require('glslify');
var PIXI = require('pixi.js');

var vert = require('../fragments/default.vert');
var frag = require('./dot.frag');

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js
 */

/**
 * This filter applies a dotscreen effect making display objects appear to be made out of
 * black and white halftone dots like an old printer.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
function DotFilter()
{
    PIXI.Filter.call(this,
        // vertex shader
        vert,
        // fragment shader
        frag
    );

    this.scale = 1;
    this.angle = 5;
}

DotFilter.prototype = Object.create(PIXI.Filter.prototype);
DotFilter.prototype.constructor = DotFilter;
module.exports = DotFilter;

Object.defineProperties(DotFilter.prototype, {
    /**
     * The scale of the effect.
     * @member {number}
     * @memberof PIXI.filters.DotFilter#
     */
    scale: {
        get: function ()
        {
            return this.uniforms.scale;
        },
        set: function (value)
        {
            this.uniforms.scale = value;
        }
    },

    /**
     * The radius of the effect.
     * @member {number}
     * @memberof PIXI.filters.DotFilter#
     */
    angle: {
        get: function ()
        {
            return this.uniforms.angle;
        },
        set: function (value)
        {
            this.uniforms.angle = value;
        }
    }
});
