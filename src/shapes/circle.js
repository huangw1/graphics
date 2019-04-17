/**
 * @Author: huangw1
 * @Date: 2019/4/17 20:54
 */
import _ from 'lodash';
import inside from './util/inside';

export default class Circle {
    static ATTRS = {
        x: 0,
        y: 0,
        r: 10,
    }

    constructor(options = {}) {
        this.attrs = _.assign({}, Circle.ATTRS, options);
    }

    includes(clientX, clientY) {
        const {x, y, r} = this.attrs;
        return inside.circle(x, y, r, clientX, clientY);
    }

    draw(ctx) {
        const {x, y, r} = this.attrs;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.closePath();
    }
}
