import _ from 'lodash';
import Layer from './layer';
import EventBus from "./eventbus";

export default class Canvas extends EventBus{
    constructor(ele, options = {}) {
        super();
        if (!ele) {
            ele = document.body;
        }
        this._options = _.assign({width: 300, height: 300}, options);
        this._getCanvas(ele);
        this._init(this._options)
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

    _init(options) {
        const {width, height} = options;
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');

        const layer = new Layer(this);
        this.layout = layer;
        this.layers = [layer];

        this._initEvents();
    }

    _initEvents() {
        this.canvas.addEventListener('click', this._eventHandle, false);
    }

    _eventHandle = (e) => {
        this.emit(e.type, e);
    }

    addShape(type, options) {
        this.layout.addShape(type, options);
    }

    getContext() {
        return this.context;
    }

    _getCanvasInstance() {
        return this;
    }

    draw() {
        this.layers.forEach(layer => {
            layer.draw(this.context);
        })
    }
}

