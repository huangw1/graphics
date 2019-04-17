/**
 * @Author: huangw1
 * @Date: 2019/4/16 23:54
 */
import line from '../math/line';

export default {
    line(x1, y1, x2, y2, lineWidth, x, y) {
        const {minX, maxX, minY, maxY} = line.boundary(x1, y1, x2, y2, lineWidth);
        if (!this.inBoundary(minX, maxX, minY, maxY, x, y)) {
            return false;
        }
        const distance = line.pointDistance(x1, y1, x2, y2, x, y);
        if(isNaN(distance)) {
            return false;
        }
        return distance - lineWidth / 2 <= 0;
    },
    rect(x, y, width, height, clientX, clientY) {
        return clientX >= x && clientX <= x + width && clientY >= y && clientY <= y + height;
    },
    inBoundary(minX, maxX, minY, maxY, x, y) {
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
}
