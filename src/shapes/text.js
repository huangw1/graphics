/**
 * @Author: huangw1
 * @Date: 2019/4/18 02:30
 */
import _ from 'lodash';
import inside from './util/inside';

export default class Text {
    static ATTRS = {
        x   : 0,
        y   : 0,
        text: ''
    }

    constructor(options = {}) {
        this.computed = {};
        this.attrs = _.assign({}, Text.ATTRS, options);
    }

    includes(clientX, clientY) {
        let {x, y, text, font, textBaseline} = this.attrs;
        let {w, h} = this.computed;
        if (!w || !h) {
            const ctx = document.createElement('canvas').getContext('2d');
            ctx.font = font;
            w = ctx.measureText(text).width;
            h = this._getCtxFontSize(ctx);
            _.assign(this.computed, {w, h})
        }
        switch (textBaseline) {
            case 'middle':
                y = y - h / 2;
                break;
            case 'top':
            case 'hanging':
                y = y + h / 8;
                break;
            default:
                /**                       ------
                 *                       |bottom|   ------
                 * (x, y)------- baseline -------- |middle|
                 *      |default|         |top|     ------
                 *       -------           ---
                 */
                y = y - h;
                break;
        }
        return inside.rect(x, y, w, h, clientX, clientY);
    }

    _getCtxFontSize(ctx) {
        const fontSize = ctx.font.match(/(^|\s)(\d+)px(\s|$)/i)[2];
        return fontSize ? +fontSize : 0;
    }

    draw(ctx, otherControl) {
        const {x, y, text} = this.attrs;
        if (this._getCtxFontSize(ctx) < 12) {
            ctx.font = ctx.font.replace(/(^|\s)(\d+)px(\s|$)/i, ' 12px ');
        }
        if (ctx.font !== this.attrs.font) {
            this.attrs.font = ctx.font;
        }
        if (ctx.textBaseline !== this.attrs.textBaseline) {
            this.attrs.textBaseline = ctx.textBaseline;
        }
        const {hasFill, hasStroke} = otherControl;
        if (hasFill) {
            ctx.fillText(text, x, y);
        }
        if (hasStroke) {
            ctx.strokeText(text, x, y);
        }
    }
}
