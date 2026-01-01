export function debounceFn(fn, delay, immediate) {
    delay = delay || 200;
    var timer;
    return function () {
        const that = this;
        const args = arguments;
        if (timer === undefined && immediate) {
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
export function throttleFn_1(fun, time = 150) {
    let t1 = 0;
    return function () {
        let t2 = new Date().getTime();
        if (t2 - t1 > time) {
            fun.apply(this, arguments);
            t1 = t2;
        }
    };
}
