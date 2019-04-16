/**
 * @Author: huangw1
 * @Date: 2019/4/16 23:58
 */
import {vec2} from "../../utils/matrix";

export default {
    pointDistance(x1, y1, x2, y2, x, y) {
        const lineDir = [x2 - x1, y2 - y1];
        if (vec2.exactEquals(lineDir, [0, 0])) {
            return NaN;
        }
        /**
         * perpendicular
         * http://mathworld.wolfram.com/Point-LineDistance2-Dimensional.html
         */
        const perDir = [-lineDir[1], lineDir[0]];
        vec2.normalize(perDir, perDir);
        const dirToPoint = [x - x1, y - y1];
        return Math.abs(vec2.dot(perDir, dirToPoint));
    },

    boundary(x1, y1, x2, y2, lineWidth) {
        const halfWidth = lineWidth / 2;
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        return {
            minX: minX - halfWidth,
            minY: minY - halfWidth,
            maxX: maxX + halfWidth,
            maxY: maxY + halfWidth
        }
    }
}
