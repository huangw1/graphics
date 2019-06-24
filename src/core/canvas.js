import _ from 'lodash';
import Layer from './layer';
import EventBus from "./eventbus";
import {assign} from "../utils/common";

export default class Canvas extends EventBus {
    static ATTRS = {
        width : 300,
        height: 300
    };

    constructor(ele, options = {}) {
        super();
        if (!ele) {
            ele = document.body;
        }
        this.attrs = assign({}, Canvas.ATTRS, options);
        this._getCanvas(ele);
        this._init(this.attrs)
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

        this.layers = [];
        this.computed = {shapeLength: 0, layerLength: 0, animate: 0};
        this._status = {drawn: false, dirty: false};
        this._initEvents();
        this._initBackground();
        this._initDrawInfo();
    }

    _initBackground() {
        const background = new Layer(this, {zIndex: -1});
        this._background = background;
        this.layers.unshift(background);
        this.emit('@change', 'layer', 1);
    }

    _initEvents() {
        this.on('@clear', this._clearEvent);
        this.on('@change', this._contentChange);
        this.canvas.addEventListener('click', this._eventHandle, false);
        this.canvas.addEventListener('dblclick', this._eventHandle, false);
        this.canvas.addEventListener('mouseup', this._eventHandle, false);
        this.canvas.addEventListener('mousedown', this._eventHandle, false);
        this.canvas.addEventListener('mousemove', this._eventHandle, false);
    }

    _setComputed(computed) {
        assign(this.computed, computed);
    }

    _contentChange = (type, count) => {
        const {shapeLength, layerLength} = this.computed;
        if (type === 'layer') {
            this._setComputed({layerLength: layerLength + count});
        } else {
            this._setComputed({shapeLength: shapeLength + count});
        }
    };

    _clearEvent = (elements) => {
        this.clearEvent(elements)
    };

    _initDrawInfo() {
        this._drawInfo = {
            drawTime: Date.now(),
            fps     : 0
        }
    }

    _updateDrawInfo() {
        const {drawTime} = this._drawInfo;
        const nowTime = Date.now();
        const fps = 1000 / (nowTime - drawTime + 0.5);
        this._drawInfo = {
            drawTime: nowTime,
            fps
        }
    }

    _eventHandle = (e) => {
        const eventType = e.type;
        const {x, y} = this.getPointInCanvas(e.clientX, e.clientY);
        const elements = this.elementsWithContext(eventType);
        const targetElements = elements.filter(element => {
            const {offsetX, offsetY} = element.container.computed;
            return element.includes(x - offsetX, y - offsetY)
        });
        this.emit(eventType, targetElements, e)
    };

    getPointInCanvas(clientX, clientY) {
        // ratio = style size(css) / real size(responsive)
        const canvas = this.canvas;
        const canvasBox = canvas.getBoundingClientRect();
        const width = canvasBox.right - canvasBox.left;
        const height = canvasBox.bottom - canvasBox.top;
        return {
            x: (clientX - canvasBox.left) * (canvas.width / width),
            y: (clientY - canvasBox.top) * (canvas.height / height)
        };
    }

    addLayer(options) {
        const layer = new Layer(this, options);
        const index = _.findLastIndex(this.layers, shape => shape.zIndex <= layer.zIndex);
        if (index === -1) {
            this.layers.unshift(layer)
        } else {
            this.layers.splice(index + 1, 0, layer);
        }
        this.emit('@change', 'layer', 1);
        return layer;
    }

    addShape(type, options) {
        this.emit('@change', 'shape', 1);
        return this._background.addShape(type, options);
    }

    getStatus() {
        return {...this._status};
    }

    setStatus(status) {
        assign(this._status, status);
    }

    getContext() {
        return this.context;
    }

    getCanvas() {
        return this.canvas;
    }

    _getCanvasInstance() {
        return this;
    }

    update() {
        const {drawn} = this.getStatus();
        if (drawn) {
            this.draw();
        }
    }

    clear() {
        const {width, height} = this.attrs;
        this.context.clearRect(0, 0, width, height);
    }

    _draw = () => {
        this.clear();
        this._updateDrawInfo();
        const status = this.getStatus();
        this.layers.forEach(layer => {
            layer._draw(this.context);
        });
        if (!status.drawn) {
            this.setStatus({drawn: true});
            this.emit('@play');
        }
        if (this.computed.animate) {
            this.timer = requestAnimationFrame(this._draw);
        } else {
            this.timer = null;
        }
    };

    draw() {
        if (this.timer) {
            cancelAnimationFrame(this.timer);
        }
        this.timer = requestAnimationFrame(this._draw);
    }
}

