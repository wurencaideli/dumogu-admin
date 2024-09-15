/**
 * requestAnimationFrame兼容性扩展，两方面工作：
 * 1、把各浏览器前缀进行统一
 * 2、在浏览器没有requestAnimationFrame方法时将其指向setTimeout方法
 * */
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz', 'o', 'ms'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        // Webkit中此取消方法的名字变了
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
})();
