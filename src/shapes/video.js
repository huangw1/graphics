/**
 * @Author: huangw1
 * @Date: 2019/4/17 20:54
 */
import inside from './util/inside';
import Shape from "../core/shape";
import {assign} from "../utils/common";

export default class Video extends Shape {
    static ATTRS = {
        x    : 0,
        y    : 0,
        w    : 10,
        h    : 10,
        video: ''
    };

    constructor(type, container, options) {
        const ops = assign({}, {attrs: Video.ATTRS}, options);
        super('Image', container, ops);
        if (typeof this.attrs.video === 'string') {
            this.setStatus({loading: true});
            this._createVideo(this.attrs.video);
        }
    }

    _createVideo(src) {
        const {w, h} = this.attrs;
        const video = document.createElement('video');
        video.setAttribute('width', w);
        video.setAttribute('height', h);
        video.setAttribute('preload', 'metadata');
        video.setAttribute('crossOrigin', 'anonymous');
        video.onplay = () => {
            this.play();
        }
        video.onloadedmetadata = () => {
            this.setAttrs({video});
            this.setStatus({loading: false});
            this.animate({attrs: {}, duration: video.duration * 1000, autoPlay: false});
            video.play();
        };
        video.src = src;
    }

    includes(clientX, clientY) {
        const {x, y, w, h} = this.attrs;
        return inside.rect(x, y, w, h, clientX, clientY);
    }

    draw(ctx) {
        const {x, y, w, h, video} = this.attrs;
        const {loading} = this.getStatus();
        if (video && !loading) {
            ctx.drawImage(video, x, y, w, h);
        }
    }
}
