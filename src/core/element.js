/**
 * @Author: huangw1
 * @Date: 2019/4/16 13:50
 */
import _ from 'lodash';
import Animate from "./animate";

const DRAW_ATTRS = [
    'fillStyle',
    'font',
    'globalAlpha',
    'lineCap',
    'lineWidth',
    'lineJoin',
    'miterLimit',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'strokeStyle',
    'textAlign',
    'textBaseline',
    'lineDash',
    'lineDashOffset'
];

export default class Element extends Animate {
    static ATTRS = {
        fillStyle  : 'black',
        strokeStyle: 'black'
    }

    constructor(container, type, options) {
        super(options.animate);

        this.container = container;
        this.type = type;
        this.computed = {};
        const drawAttrs = {};
        if (options.attrs) {
            Object.keys(options.attrs).forEach(key => {
                if (DRAW_ATTRS.includes(key)) {
                    drawAttrs[key] = options.attrs[key];
                }
            });
        }
        this.drawAttrs = _.assign({}, Element.ATTRS, drawAttrs);
        this.zIndex = options.zIndex || 0;
    }

    getContext() {
        return this.container.getContext();
    }

    getCanvas() {
        return this.container.getCanvas();
    }

    _getCanvasInstance() {
        return this.container._getCanvasInstance();
    }

    // implement override
    includes() {
        return true;
    }

    on(type, fun) {
        const canvasInstance = this._getCanvasInstance();
        canvasInstance.on(type, fun, this);
    }
}
