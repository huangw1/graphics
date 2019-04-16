/**
 * @Author: huangw1
 * @Date: 2019/4/16 12:58
 */
import _ from 'lodash';

export default class Line {
    constructor(options = {}) {
        this._attrs = _.assign({}, options);
    }

    draw(ctx) {
        const { x1, y1, x2, y2, ...otherAttrs } = this._attrs;
        Object.keys(otherAttrs).forEach(key => ctx[key] = otherAttrs[key]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
    }
}
