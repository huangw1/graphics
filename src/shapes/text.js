/**
 * @Author: huangw1
 * @Date: 2019/4/18 02:30
 */
import inside from './util/inside';
import Shape from "../core/shape";
import {assign} from "../utils/common";

export default class Text extends Shape {
    static ATTRS = {
        x   : 0,
        y   : 0,
        text: ''
    };

    constructor(type, container, options) {
        const ops = assign({}, {attrs: Text.ATTRS}, options);
        super('Text', container, ops);
    }

    includes(clientX, clientY) {
        let {x, y, text} = this.attrs;
        let {font, textBaseline} = this.style;
        let {w, h} = this.computed;
        if (!w || !h) {
            const ctx = document.createElement('canvas').getContext('2d');
            ctx.font = font;
            w = ctx.measureText(text).width;
            h = this._getCtxFontSize(ctx);
            assign(this.computed, {w, h})
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
        const {hasFill, hasStroke} = otherControl;
        if (hasFill) {
            ctx.fillText(text, x, y);
        }
        if (hasStroke) {
            ctx.strokeText(text, x, y);
        }
    }
}
