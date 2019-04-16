/**
 * @Author: huangw1
 * @Date: 2019/4/16 13:07
 */
import _ from 'lodash';
import Element from "./element";
import Shape from "./shape";

export default class Layer extends Element {
    constructor(container, options = {}) {
        super(container);
        this.attrs = _.assign({}, options.attrs);
        this.shapes = [];
    }

    addShape(type, options) {
        const shapeType = _.upperFirst(type);
        const shape = new Shape(shapeType, options, this);
        this.shapes.push(shape);
        return shape;
    }

    draw(ctx) {
        const context = ctx || this.getContext();
        this.shapes.forEach(shape => {
            shape.draw(context);
        });
    }
}
