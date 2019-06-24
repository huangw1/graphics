/**
 * @Author: huangw1
 * @Date: 2019/4/16 16:05
 */
const PRECISION = 0.00001;

export const isNumberEqual = (a, b) => {
    return Math.abs(a - b) <= PRECISION;
};

// guard positive
export const mod = (n, m) => {
    return ((n % m) + m) % m;
};

export const clamp = (a, min, max) => {
    if (a < min) {
        return min;
    } else if (a > max) {
        return max;
    }
    return a;
}

export const assign = (target, ...params) => {
    if (params.length === 0) {
        return target;
    }
    params.forEach(param => {
        if (param) {
            Object.keys(param).forEach(key => {
                if (param[key] && typeof param[key] === 'object' && !(param[key] instanceof HTMLElement)) {
                    target[key] = assign({}, target[key], param[key])
                } else {
                    target[key] = param[key]
                }
            })
        }
    });
    return target
};
