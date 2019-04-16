/**
 * @Author: huangw1
 * @Date: 2019/4/16 13:07
 */
import _ from 'lodash';
import Element from "./element";
import Shape from "./shape";
import {clamp} from "../utils/common";

export default class Layer extends Element {
    static ATTRS = {
        x      : 0,
        y      : 0,
        opacity: 1
    }

    constructor(container, options = {}) {
        super(container, 'Layer', options.attrs);
        this.attrs = _.assign({}, Layer.ATTRS, options);
        this.shapes = [];
        let offsetX = this.attrs.x;
        let offsetY = this.attrs.y;
        if (container instanceof Layer) {
            offsetX += container.computed.x;
            offsetY += container.computed.y;
        }
        this.computed = _.assign(this.computed, {offsetX, offsetY});
    }

    includes(x, y) {
        if (this.shapes.length) {
            return this.shapes.some(shape => shape.includes(x, y));
        }
        return false;
    }

    addLayer(options) {
        const layer = new Layer(this, options);
        this.shapes.push(layer);
        return layer;
    }

    addShape(type, options) {
        const shapeType = _.upperFirst(type);
        const shape = new Shape(shapeType, options, this);
        this.shapes.push(shape);
        return shape;
    }

    draw(ctx) {
        const context = ctx || this.getContext();
        const {x, y, opacity} = this.attrs;
        const ga = context.globalAlpha;
        context.save();
        Object.keys(this.canvasAttrs).forEach(attr => {
            context[attr] = this.canvasAttrs[attr];
        });
        context.globalAlpha = clamp(opacity * ga, 0, 1);
        context.translate(x, y);
        this.shapes.forEach(shape => {
            shape.draw(context);
        });
    }
}
