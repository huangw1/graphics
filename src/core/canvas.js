import _ from 'lodash';
import Layer from './layer';
import EventBus from "./eventbus";

export default class Canvas extends EventBus {
    static ATTRS = {
        width : 300,
        height: 300
    }

    constructor(ele, options = {}) {
        super();
        if (!ele) {
            ele = document.body;
        }
        this.attrs = _.assign({}, Canvas.ATTRS, options);
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

        const layer = new Layer(this);
        this.layout = layer;
        this.layers = [layer];

        this._status = {drawn: false};
        this._initEvents();
        this._initDrawInfo();
    }

    _initEvents() {
        this.canvas.addEventListener('click', this._eventHandle, false);
        this.on('canvas:update', this.update);
    }

    _initDrawInfo() {
        this.drawInfo = {
            drawTime: Date.now(),
            fps     : 0
        }
    }

    _updateDrawInfo() {
        const {drawTime} = this.drawInfo;
        const nowTime = Date.now();
        const fps = 1000 / (nowTime - drawTime + 0.5);
        console.log('fps: ', fps);
        this.drawInfo = {
            drawTime: nowTime,
            fps
        }
    }

    _eventHandle = (e) => {
        const eventType = e.type;
        const {x, y} = this.getPointInCanvas(e.clientX, e.clientY);
        const elements = this.elementsWithContext(eventType);
        const targetElements = elements.filter(element => element.includes(x, y));
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
        return layer;
    }

    addShape(type, options) {
        return this.layout.addShape(type, options);
    }

    getStatus() {
        return {...this._status};
    }

    setStatus(status) {
        Object.assign(this._status, status);
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

    clear() {
        const {width, height} = this.attrs;
        this.context.clearRect(0, 0, width, height);
    }

    update = () => {
        const {drawTime} = this.drawInfo;
        const now = Date.now();
        if (now - drawTime > 10) {
            this.draw();
        }
    };

    draw() {
        this.clear();
        this._updateDrawInfo();
        this.layers.forEach(layer => {
            layer._draw(this.context);
        });
        if (!this._status.drawn) {
            this._status.drawn = true;
            this.emit('canvas:play');
        }
    }
}

