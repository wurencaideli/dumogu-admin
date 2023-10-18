/*jshint esversion: 9 */
/*
 * 简单的页面滚动工具 一篇文字
 */

//从开始的位置移动到结束的位置（匀速）
export function simpleRoll({
    end=0,time = 100,target,
}={}){
    target = target || document.documentElement || document.body;
    let timer;
    let startTime = +new Date();
    let start = target.scrollTop || 0;
    let lengthY = start - end;
    timer = requestAnimationFrame(function func(){
        //获取下一帧的时间距离开始的时间，以此计算此时的位置，如果超过了预计的时间，则就等于参数所规定的时间
        let timeX = time - Math.max(0,startTime - (+new Date()) + time);
        target.scrollTop = timeX * (-lengthY) / time + start;
        timer = requestAnimationFrame(func);
        //如果距离开始时间已经到了规定的时间则不用在执行了
        if(timeX == time){
            cancelAnimationFrame(timer);
        }
    });
}