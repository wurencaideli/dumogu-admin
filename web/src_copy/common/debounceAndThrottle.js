/*jshint esversion: 9 */
/*
 防抖和节流工具函数 一篇文字
 */
// 防抖（immediate=true代表只执行第一次和最后一次）
export function debounceFn(fn, delay, immediate) {
    delay = delay || 200;
    var timer;
    return function () {
        const that = this;
        const args = arguments;
        if (timer === undefined && immediate) {
            //如果是第一次则执行
            timer = setTimeout(() => {
                timer = undefined;
            }, delay);
            fn.apply(that, args);
        } else {
            clearTimeout(timer);
            timer = setTimeout(function () {
                timer = undefined;
                fn.apply(that, args);
            }, delay);
        }
    };
}
// 节流
export function throttleFn(fn, interval) {
    var last;
    var timer;
    interval = interval || 200;
    return function () {
        var th = this;
        var args = arguments;
        var now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                fn.apply(th, args);
            }, interval);
        } else {
            last = now;
            fn.apply(th, args);
        }
    };
}
/**
 * 节流 1
 * 另一种方式
 *  */
export function throttleFn_1(fun, time = 150) {
    let t1 = 0; //初始时间
    return function () {
        let t2 = new Date().getTime(); //当前时间
        if (t2 - t1 > time) {
            fun.apply(this, arguments);
            t1 = t2;
        }
    };
}
