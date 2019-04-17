/**
 * @Author: huangw1
 * @Date: 2019/4/16 12:58
 */
import _ from 'lodash';
import inside from './util/inside';

export default class Line {
    static ATTRS = {
        x1       : 0,
        y1       : 0,
        x2       : 0,
        y2       : 10,
        lineWidth: 1
    }

    constructor(options = {}) {
        this.attrs = _.assign({}, Line.ATTRS, options);
    }

    includes(clientX, clientY) {
        const {x1, y1, x2, y2, lineWidth} = this.attrs;
        return inside.line(x1, y1, x2, y2, lineWidth, clientX, clientY);
    }

    draw(ctx) {
        const {x1, y1, x2, y2} = this.attrs;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
    }
}
