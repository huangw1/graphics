/**
 * @Author: huangw1
 * @Date: 2019/4/16 13:41
 */
import Element from './element';

export default class EventBus {
    constructor() {
        this.events = {};
    }

    elementsWithContext(type) {
        return (this.events[type] || []).filter(item => item.context).map(item => item.context);
    }

    on(type, fun, context) {
        const event = {type, fun, context};
        if (type in this.events) {
            if (!this.events[type].find(item => item.context === event.context && item.fun === event.fun)) {
                this.events[type].push(event)
            }
        } else {
            this.events[type] = [event]
        }
    }

    off(type, fun, context) {
        if (!fun) {
            this.events[type] = [];
        } else if (type in this.events) {
            this.events[type].forEach((item, i) => {
                if (item.context === context && item.fun === fun) {
                    this.events[type].splice(i--, 1)
                }
            })
        }
    }

    emit(type, context, ...data) {
        if (type in this.events) {
            const isElement = context instanceof Element || (Array.isArray(context) && context.every(ctx => ctx instanceof Element));
            if (isElement) {
                context = Array.isArray(context) ? context : [context];
                this.events[type].filter(item => context.indexOf(item.context) !== -1).forEach(event => {
                    event.fun(...data)
                })
            } else {
                this.events[type].forEach(event => {
                    event.fun(context, ...data)
                })
            }
        }
    }

    addEventListener(...arg) {
        this.on(...arg);
    }

    removeEventListener(...arg) {
        this.off(...arg);
    }

    trigger(...arg) {
        this.emit(...arg);
    }
}

