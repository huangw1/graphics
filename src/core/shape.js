/**
 * @Author: huangw1
 * @Date: 2019/4/16 14:12
 */
import _ from 'lodash';
import * as shapes from '../shapes';
import Element from "./element";

export default class Shape extends Element {
    constructor(type, options, container) {
        super(container);
        this._init(type, options);
    }

    _init(type, options) {
        const {attrs, ...otherControl} = options;
        const defaultControl = {hasFill: true, hasStroke: false};
        if(type === 'Line') {
            _.assign(defaultControl, {hasFill: false, hasStroke: true});
        }
        this.attrs = _.assign(defaultControl, otherControl);
        this.shape = new shapes[type](attrs);
    }

    draw(ctx) {
        const context = ctx || this.getContext();
        const {hasFill, hasStroke} = this.attrs;
        context.save();
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
