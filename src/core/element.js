/**
 * @Author: huangw1
 * @Date: 2019/4/16 13:50
 */
import _ from 'lodash';
import * as easing from '../utils/easing';

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

    static ATTRS = {
        fillStyle  : 'black',
        strokeStyle: 'black'
    };

    constructor(container, type, options) {
        this.container = container;
        this.type = type;
        this.attrs = {};
        this.computed = {};
        const drawAttrs = {};
        if (options.attrs) {
            Object.keys(options.attrs).forEach(key => {
                if (Element.DRAW_ATTRS.includes(key)) {
                    drawAttrs[key] = options.attrs[key];
                }
            });
        }
        this.drawAttrs = _.assign({}, Element.ATTRS, drawAttrs);
        this.animateAttrs = _.assign({}, options.animate);
        this.zIndex = options.zIndex || 0;
        this._status = {dirty: true};
    }

    getStatus() {
        return {...this._status};
    }

    setStatus(status) {
        Object.assign(this._status, status);
        // if (status.dirty) {
        //     this._noticeParent({dirty: true});
        // }
    }

    animate(options) {
        const {attrs, effect = 'linear', duration, delay, autoPlay = true} = options;
        const initAttrs = this.getAttrs();
        const from = {};
        const to = attrs;
        const diff = {};
        Object.keys(attrs).forEach(key => {
            from[key] = initAttrs[key];
            diff[key] = to[key] - from[key];
        });
        this.animateAttrs = {effect, startTime: Date.now() + delay, status: 'ready', from, to, diff, duration};
        if (autoPlay) {
            this.play();
        }

    }

    play = () => {
        this.timer = requestAnimationFrame(this._animate);
    };

    _animate = () => {
        const {effect, startTime, from, to, diff, duration} = this.animateAttrs;
        const canvasInstance = this._getCanvasInstance();
        const passTime = new Date().getTime() - startTime;
        if (passTime > 0) {
            if (passTime < duration) {
                const ratio = passTime / duration;
                const currentAttrs = {};
                Object.keys(from).forEach(key => {
                    currentAttrs[key] = from[key] + diff[key] * easing[effect](ratio);
                });
                this.setAttrs(currentAttrs);
                _.assign(this.animateAttrs, {status: 'playing'})
            } else {
                this.setAttrs(to);
                _.assign(this.animateAttrs, {status: 'stop'})
            }
            canvasInstance.draw();
        }
        if (passTime < duration) {
            this.timer = requestAnimationFrame(this._animate);
        } else {
            cancelAnimationFrame(this.timer);
            this.timer = null;
        }
    }

    getAttrs() {
        return this.attrs;
    }

    setAttrs(attrs) {
        _.assign(this.attrs, attrs);
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
        const canvas = this._getCanvasInstance();
        canvas.emit('canvas:update');
    }

    on(type, fun) {
        const canvasInstance = this._getCanvasInstance();
        canvasInstance.on(type, fun, this);
    }

    off(type, fun) {
        const canvasInstance = this._getCanvasInstance();
        canvasInstance.off(type, fun, this);
    }
}
