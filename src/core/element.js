/**
 * @Author: huangw1
 * @Date: 2019/4/16 13:50
 */
import _ from 'lodash';

const CANVAS_ATTRS = [
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

export default class Element {
    static ATTRS = {
        fillStyle  : 'black',
        strokeStyle: 'black'
    }

    constructor(container, type, options) {
        this.container = container;
        this.type = type;
        this.computed = {};
        const canvasAttrs = {};
        if (options.attrs) {
            Object.keys(options.attrs).forEach(key => {
                if (CANVAS_ATTRS.includes(key)) {
                    canvasAttrs[key] = options.attrs[key];
                }
            });
        }
        this.canvasAttrs = _.assign({}, Element.ATTRS, canvasAttrs);
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
