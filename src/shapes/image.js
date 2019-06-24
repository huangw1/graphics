/**
 * @Author: huangw1
 * @Date: 2019/4/17 20:54
 */
import inside from './util/inside';
import Shape from "../core/shape";
import {assign} from "../utils/common";

export default class Imagee extends Shape {
    static ATTRS = {
        x: 0,
        y: 0,
        w: 10,
        h: 10,
        img: ''
    };

    constructor(type, container, options) {
        const ops = assign({}, {attrs: Imagee.ATTRS}, options);
        super('Image', container, ops);
        if (typeof this.attrs.img === 'string') {
            this.setStatus({ loading: true });
            this._createImage(this.attrs.img);
        }
    }

    _createImage(src) {
        const img = new Image();
        img.onload = () => {
            this.setAttrs({ img });
            this.setStatus({ loading: false });
            this.update();
        };
        img.src = src;
    }

    includes(clientX, clientY) {
        const {x, y, w, h} = this.attrs;
        return inside.rect(x, y, w, h, clientX, clientY);
    }

    draw(ctx) {
        const {x, y, w, h, img} = this.attrs;
        const { loading } = this.getStatus();
        if (img && !loading) {
            ctx.drawImage(img, x, y, w, h);
        }
    }
}
