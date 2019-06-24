/**
 * @Author: huangw1
 * @Date: 2019/4/16 14:12
 */
import Element from "./element";
import {assign, clamp} from "../utils/common";

export default class Shape extends Element {
    static ATTRS = {
        hasFill  : true,
        hasStroke: false,
        opacity  : 1
    }

    constructor(type, container, options = {}) {
        const ops = assign({}, {attrs: Shape.ATTRS}, options);
        if (type === 'Line') {
            ops.attrs.hasFill = false;
            ops.attrs.hasStroke = true;
        }
        super(type, container, ops);
    }

    _draw(ctx) {
        const context = ctx || this.getContext();
        const {hasFill, hasStroke, opacity} = this.attrs;
        const ga = context.globalAlpha;
        context.save();
        context.globalAlpha = clamp(opacity * ga, 0, 1);
        Object.keys(this.style).forEach(attr => {
            context[attr] = this.style[attr];
        });
        this.draw(context, this.attrs);
        if (this.type !== 'Text') {
            if (hasStroke) {
                context.stroke();
            }
            if (hasFill) {
                context.fill();
            }
        }
        context.restore();
    }
}
