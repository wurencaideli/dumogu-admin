/**
 * 定时任务，由外部注入事件
 */
const schedule = require('node-schedule');

/** 被注入的待执行方法 */
const needCallFn = {
    'night-3':[],  // 凌晨3点需要执行的定时任务
};
/** 初始化服务 */
function start() {
    /**
     * 一些定时任务
     * 这是每天凌晨 3 点执行的任务
     *  */
    schedule.scheduleJob('0 3 * * *', function () {
        needCallFn['night-3'].forEach(fn=>{
            fn();
        });
    });
}
module.exports = {
    start,
    needCallFn,
};
