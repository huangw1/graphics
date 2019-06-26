/**
 * @Author: huangw1
 * @Date: 2019/4/16 13:50
 */
import * as easing from '../utils/easing';
import {assign} from "../utils/common";
import {interpolate, interpolateNumber, interpolateRgb} from "d3-interpolate";

export default class Element {
    static DRAW_ATTRS = [
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

    constructor(type, container, options) {
        this.container = container;
        this.type = type;
        this.computed = {};
        this.attrs = options.attrs;
        this.zIndex = options.zIndex || 0;
        this._status = {drawn: false, dirty: true};

        this._initStyle(options.style);
        this._initEvent(options.event);
        this._initAnimate(options.animate);
    }

    _initStyle(style = {}) {
        const containStyle = this.container.style;
        const calcStyle = {};
        Object.keys(style).forEach(key => {
            if (Element.DRAW_ATTRS.includes(key)) {
                calcStyle[key] = style[key];
            }
        });
        this.style = assign({}, containStyle, calcStyle);
    }

    _initEvent(event) {
        if (event && typeof event === 'object') {
            Object.keys(event).forEach(key => this.on(key, event[key]))
        }
    }

    _initAnimate(animate) {
        this.animateAttrs = assign({}, animate);
        if (animate) {
            this.animate(this.animateAttrs)
        }
    }

    animate(options) {
        const {attrs = {},
            style = {},
            effect = 'linear',
            duration,
            delay = 0,
            autoPlay = true,
            repeat = false,
            loop = false
        } = options;
        const to = {attrs, style};
        const from = {attrs: {}, style: {}};
        const diff = {attrs: {}, style: {}};
        const init = {attrs: this.getAttrs(), style: this.getStyle()};
        Object.keys(to).forEach(type => {
            Object.keys(to[type]).forEach(key => {
                const start = init[type][key];
                const end = to[type][key];
                from[type][key] = start;
                if(['fillStyle', 'strokeStyle'].includes(key)) {
                    diff[type][key] = interpolateRgb(start, end);
                } else if(typeof init[type][key] === 'number') {
                    diff[type][key] = interpolateNumber(start, end);
                } else {
                    diff[type][key] = interpolate(start, end);
                }
            });
        });
        this.animateAttrs = {
            effect,
            startTime: Date.now() + delay,
            status   : 'ready',
            from,
            to,
            diff,
            duration,
            repeat,
            delay,
            loop
        };
        if (autoPlay) {
            this.play();
        }

    }

    play = () => {
        const {status, delay} = this.animateAttrs;
        const canvasInstance = this._getCanvasInstance();
        const canvasStatus = canvasInstance.getStatus();
        if (canvasStatus.drawn) {
            if (status === 'ready') {
                assign(this.animateAttrs, {startTime: Date.now() + delay});
                const animateCount = canvasInstance.computed.animate;
                canvasInstance._setComputed({animate: animateCount + 1});
                canvasInstance.draw();
                this.timer = requestAnimationFrame(this._animate);
            }
        } else {
            this.once('@play', this.play);
        }
    };

    stop = () => {
        const {status} = this.animateAttrs;
        const canvasInstance = this._getCanvasInstance();
        if (status === 'stop') {
            cancelAnimationFrame(this.timer);
            this.timer = null;
            const animateCount = canvasInstance.computed.animate;
            canvasInstance._setComputed({animate: animateCount - 1});
        }
    };

    _animate = () => {
        const {effect, startTime, from, to, diff, duration, repeat, loop} = this.animateAttrs;
        const passTime = Date.now() - startTime;
        if (passTime > 0) {
            if (passTime < duration) {
                const ratio = passTime / duration;
                const currentAttrs = {attrs: {}, style: {}};
                Object.keys(diff).forEach(type => {
                    Object.keys(diff[type]).forEach(key => {
                        currentAttrs[type][key] = diff[type][key](easing[effect](ratio));
                    });
                });
                this.setAttrs(currentAttrs.attrs);
                this.setStyle(currentAttrs.style);
                this.setStatus({dirty: true});
                assign(this.animateAttrs, {status: 'playing', lastTime: Date.now()});
                this.timer = requestAnimationFrame(this._animate);
            } else if (loop) {
                this.setAttrs(to.attrs);
                this.setStyle(to.style);
                this.setStatus({dirty: true});
                this.animate({duration, effect, loop, ...from})
            } else if (repeat) {
                this.setAttrs(from.attrs);
                this.setStyle(from.style);
                this.setStatus({dirty: true});
                assign(this.animateAttrs, {status: 'playing', startTime: Date.now(), lastTime: Date.now()});
                this.timer = requestAnimationFrame(this._animate);
            } else {
                this.setAttrs(to.attrs);
                this.setStyle(to.style);
                this.setStatus({dirty: true});
                assign(this.animateAttrs, {status: 'stop'});
                this.stop();
            }
        } else {
            setTimeout(this._animate, -passTime);
        }
    };

    getAttrs() {
        return {...this.attrs};
    }

    setAttrs(attrs) {
        assign(this.attrs, attrs);
    }

    getStyle() {
        return {...this.style};
    }

    setStyle(style) {
        assign(this.style, style);
    }

    getStatus() {
        return {...this._status};
    }

    setStatus(status) {
        Object.assign(this._status, status);
        this._noticeParentStatus(status)
    }

    _noticeParentStatus(status) {
        const parent = this.container;
        if (parent.type === 'Layer') {
            parent.setStatus(status);
        }
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

    includes() {
        return true;
    }

    update() {
        const canvasInstance = this._getCanvasInstance();
        canvasInstance.update();
    }

    on(type, fun) {
        const canvasInstance = this._getCanvasInstance();
        canvasInstance.on(type, fun, this);
    }

    once(type, fun) {
        const canvasInstance = this._getCanvasInstance();
        canvasInstance.on(type, fun, this, true);
    }

    off(type, fun) {
        const canvasInstance = this._getCanvasInstance();
        canvasInstance.off(type, fun, this);
    }
}
