/**
 *
 * 生成从minNum到maxNum的随机数
 */
export function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0;
    }
}
/**
 * 数字四舍五入
 * value:number
 * length:number
 */
export function numberToFixed(value, length = 0) {
    value = Number(value);
    return Number(Number.prototype.toFixed.call(value, length));
}
