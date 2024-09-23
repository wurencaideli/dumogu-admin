/*jshint esversion: 9 */
/*
 * 简单的页面滚动工具 一篇文字
 */

/**
 * 从开始的位置移动到结束的位置（匀速，固定时间）
 */
export function simpleRoll(params = {}) {
    let top = undefined;
    let left = undefined;
    /** 如果不传值则不做处理top位置 */
    if (params.hasOwnProperty('top')) {
        top = Number(params.top) || 0;
    }
    if (params.hasOwnProperty('left')) {
        left = Number(params.left) || 0;
    }
    let time = Number(params.time) || 0;
    let target = params.target;
    if (!target) {
        console.warn('请传入滚动容器元素');
        return;
    }
    let hasLeft = left !== undefined;
    let hasTop = top !== undefined;
    if (!hasLeft && !hasTop) {
        console.warn('请传入top || left值');
        return;
    }
    let startTime = Date.now();
    let scrollTop = target.scrollTop || 0;
    let scrollLeft = target.scrollLeft || 0;
    let lengthY = top - scrollTop;
    let lengthX = left - scrollLeft;
    requestAnimationFrame(function func() {
        /** 时间进度 */
        let schedule = (Date.now() - startTime) / time;
        // 到达指定时间了，停止执行
        if (schedule >= 1) {
            if (hasLeft) {
                target.scrollLeft = lengthX + scrollLeft;
            }
            if (hasTop) {
                target.scrollTop = lengthY + scrollTop;
            }
            return;
        }
        /** 此时的位置 */
        if (hasTop) {
            target.scrollTop = lengthY * schedule + scrollTop;
        }
        if (hasLeft) {
            target.scrollLeft = lengthX * schedule + scrollLeft;
        }
        requestAnimationFrame(func);
    });
}
