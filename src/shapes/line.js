/**
 * @Author: huangw1
 * @Date: 2019/4/16 12:58
 */
import inside from './util/inside';
import Shape from "../core/shape";
import {assign} from "../utils/common";

export default class Line extends Shape {
    static ATTRS = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 10
    };

    constructor(type, container, options) {
        const ops = assign({}, {attrs: Line.ATTRS}, {style: {lineWidth: 1}}, options);
        super('Line', container, ops);
    }

    includes(clientX, clientY) {
        const {x1, y1, x2, y2} = this.attrs;
        const {lineWidth} = this.style;
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
