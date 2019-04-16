/**
 * @Author: huangw1
 * @Date: 2019/4/16 13:50
 */
export default class Element {
    constructor(container) {
        this.container = container;
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

    on(type, fun) {
        const canvasInstance = this._getCanvasInstance();
        canvasInstance.on(type, fun, this);
    }
}
