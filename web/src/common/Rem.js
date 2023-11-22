/*jshint esversion: 9 */
/*
 * 一篇文字
 * 全局像素计算方法，设置基础的font-size，当宽度改变时按照倍数相应改变
 */

let baseSize = 16;  //基础大小，可由外部调用时指定
export function setRem(baseSize_) {  //可由外部世界调用
    baseSize = baseSize_ || baseSize;
    let scale = document.documentElement.clientWidth / 1920;
    let fontSize = Math.round(baseSize * scale*100)/100 + 'px';
    if(document.documentElement.style.fontSize == fontSize) return;
    document.documentElement.style.fontSize = fontSize;
}

setRem();

/** 计算的时机 */
window.addEventListener("resize",()=>{
    setRem();
});
setInterval(()=>{
    setRem();
},300);