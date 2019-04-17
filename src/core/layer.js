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
        super(container, 'Layer', options);
        this.attrs = _.assign({}, Layer.ATTRS, options.attrs);
        this.shapes = [];
        let offsetX = this.attrs.x;
        let offsetY = this.attrs.y;
        if (container instanceof Layer) {
            offsetX += container.computed.x;
            offsetY += container.computed.y;
        }
        this.computed = _.assign(this.computed, {offsetX, offsetY});
    }

    includes(clientX, clientY) {
        const {offsetX, offsetY} = this.computed;
        if (clientX >= offsetX && clientY >= offsetY) {
            if (this.shapes.length) {
                return this.shapes.some(shape => shape.includes(clientX, clientY));
            }
        }
        return false;
    }

    _insertElement(element, zIndex) {
        const index = _.findLastIndex(this.shapes, shape => shape.zIndex <= zIndex);
        if (index === -1) {
            this.shapes.unshift(element)
        } else {
            this.shapes.splice(index + 1, 0, element);
        }
    }

    addLayer(options) {
        const layer = new Layer(this, options);
        this._insertElement(layer, layer.zIndex);
        return layer;
    }

    addShape(type, options) {
        const shapeType = _.upperFirst(type);
        const shape = new Shape(shapeType, options, this);
        this._insertElement(shape, shape.zIndex);
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
        context.restore();
    }
}
