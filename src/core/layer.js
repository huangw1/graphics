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

        this._setOffset();
        this._initPalette();
    }

    _setOffset() {
        const container = this.container;
        let offsetX = this.attrs.x;
        let offsetY = this.attrs.y;
        if (container instanceof Layer) {
            offsetX += container.computed.x;
            offsetY += container.computed.y;
        }
        this.computed = _.assign(this.computed, {offsetX, offsetY});
    }

    _initPalette() {
        const canvas = this.getCanvas();
        const palette = document.createElement('canvas');
        palette.width = canvas.width;
        palette.height = canvas.height;
        this.palette = palette;
        this._initBrush()
    }

    _initBrush() {
        const {attrs, drawAttrs} = this;
        const brush = this.palette.getContext('2d');
        const {opacity} = attrs;
        const parentBrush = this.getContext();
        const parentDrawAttrs = {};
        Element.DRAW_ATTRS.forEach(key => {
            parentDrawAttrs[key] = parentBrush[key];
        });
        const brushStyle = {...parentDrawAttrs, drawAttrs};
        brushStyle.globalAlpha = clamp(brushStyle.globalAlpha * opacity, 0, 1);
        Object.keys(brushStyle).forEach(key => brush[key] = brushStyle[key]);
        this.brush = brush;
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

    remove(...shapes) {
        const elements = _.remove(this.shapes, (shape) => shapes.includes(shape));
        if(elements.length) {
            const canvas = this._getCanvasInstance();
            canvas.emit('canvas:clear', {elements});
        }
    }

    getContext() {
        const {container} = this;
        if (container.type === 'Layer') {
            return container.brush;
        }
        return container.getContext();
    }

    _draw(ctx) {
        const {shapes, brush, palette, attrs} = this;
        const {x, y} = attrs;
        const state = this.getStatus();
        if (state.dirty) {
            brush.clearRect(0, 0, palette.width, palette.height);
            shapes.forEach(shape => {
                shape._draw(brush);
            });
        }
        ctx.drawImage(palette, x, y, palette.width, palette.height);
        this.setStatus({dirty: false})
    }
}
