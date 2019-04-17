/**
 * @Author: huangw1
 * @Date: 2019/4/16 14:12
 */
import _ from 'lodash';
import * as shapes from '../shapes';
import Element from "./element";
import {clamp} from "../utils/common";

export default class Shape extends Element {
    static ATTRS = {
        hasFill  : true,
        hasStroke: false,
        opacity  : 1
    }

    constructor(type, options = {}, container) {
        super(container, 'Shape', options);
        this._init(type, options);
    }

    _init(type, options) {
        const {attrs, ...otherControl} = options;
        if (type === 'Line') {
            _.assign(otherControl, {hasFill: false, hasStroke: true});
        }
        this.type = type;
        this.attrs = _.assign({}, Shape.ATTRS, otherControl);
        if (!shapes[type]) {
            throw `unknown shape ${type}!`
        }
        this.shape = new shapes[type](attrs);
    }

    includes(x, y) {
        const {computed} = this.container;
        return this.shape.includes(x - computed.offsetX, y - computed.offsetY);
    }

    draw(ctx) {
        const context = ctx || this.getContext();
        const {hasFill, hasStroke, opacity} = this.attrs;
        const ga = context.globalAlpha;
        context.save();
        context.globalAlpha = clamp(opacity * ga, 0, 1);
        Object.keys(this.canvasAttrs).forEach(attr => {
            context[attr] = this.canvasAttrs[attr];
        });
        this.shape.draw(context);
        if (hasStroke) {
            context.stroke();
        }
        if (hasFill) {
            context.fill();
        }
        context.restore();
    }
}
