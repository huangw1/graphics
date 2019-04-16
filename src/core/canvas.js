export default class Canvas {
    constructor(ele, options = {}) {
        if (!ele) {
            ele = document.body;
        }
        this._getCanvas(ele);
    }

    _getCanvas(container) {
        let canvas;
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        if (container instanceof HTMLCanvasElement) {
            canvas = container;
            container = container.parentElement;
        } else if (container instanceof HTMLElement) {
            canvas = document.createElement('canvas');
            container.appendChild(canvas);
        }
        if (!canvas) {
            throw 'get canvas element failed!'
        }
        this.canvas = canvas;
        this.container = container;
    }
}

