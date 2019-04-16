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
