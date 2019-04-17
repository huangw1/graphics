/**
 * @Author: huangw1
 * @Date: 2019/4/17 19:51
 */
import _ from 'lodash';
import inside from './util/inside';

export default class Rect {
    // clockwise
    static ATTRS = {
        x : 0,
        y : 0,
        w : 10,
        h : 10,
        cw: true
    }

    constructor(options = {}) {
        this.attrs = _.assign({}, Rect.ATTRS, options);
    }

    includes(clientX, clientY) {
        const {x, y, w, h} = this.attrs;
        return inside.rect(x, y, w, h, clientX, clientY);
    }

    draw(ctx) {
        const {x, y, w, h, cw} = this.attrs;
        ctx.beginPath();
        ctx.moveTo(x, y);
        if (cw) {
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
        } else {
            ctx.lineTo(x, y + h);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x + w, y);
        }
        ctx.closePath();
    }
}
