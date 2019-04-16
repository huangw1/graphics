/**
 * @Author: huangw1
 * @Date: 2019/4/16 13:50
 */
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
    constructor(container, type, attrs = {}) {
        this.container = container;
        this.type = type;
        this.computed = {};
        const canvasAttrs = {};
        Object.keys(attrs).forEach(key => {
            if (CANVAS_ATTRS.includes(key)) {
                canvasAttrs[key] = attrs[key];
            }
        });
        this.canvasAttrs = canvasAttrs;
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
