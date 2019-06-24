/**
 * @Author: huangw1
 * @Date: 2019/4/17 20:54
 */
import inside from './util/inside';
import Shape from "../core/shape";
import {assign} from "../utils/common";

export default class Circle extends Shape {
    static ATTRS = {
        x: 0,
        y: 0,
        r: 10
    };

    constructor(type, container, options) {
        const ops = assign({}, {attrs: Circle.ATTRS}, options);
        super('Circle', container, ops);
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
