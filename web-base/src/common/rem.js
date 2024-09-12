/*jshint esversion: 9 */
/*
 * 一篇文字
 * 全局像素计算方法，设置基础的font-size，当宽度改变时按照倍数相应改变
 */

/** 设置font-size */
let fontSize = undefined;
export function setRem(fontSize_) {
    if (!fontSize_) return;
    fontSize = fontSize_;
    if (document.documentElement.style.fontSize == fontSize) return;
    document.documentElement.style.fontSize = fontSize;
}

setRem();

/** 计算的时机 */
window.addEventListener('resize', () => {
    setRem();
});
setInterval(() => {
    setRem();
}, 300);
