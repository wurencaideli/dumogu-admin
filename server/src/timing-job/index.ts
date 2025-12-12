import schedule from 'node-schedule';

const jobOptions: any = {
    'time-3': {
        cron: '0 3 * * *',
        jobs: [],
    }, // 凌晨3点需要执行的定时任务
    'time-4': {
        cron: '0 4 * * *',
        jobs: [],
    },
};
/** 注入新的事件 */
export function addJob(name: string, fn: any) {
    const jobs = jobOptions[name].jobs;
    if (!jobs) return;
    jobs.push(fn);
}
/** 清除事件 */
export function removeJob(name: string, fn: any) {
    const jobs = jobOptions[name].jobs;
    if (!jobs) return;
    const index = jobs.findIndex((job: any) => job === fn);
    if (index === -1) return;
    jobs.splice(index, 1);
}
/** 初始化服务 */
export function start() {
    Object.keys(jobOptions).forEach((key) => {
        const cron = jobOptions[key].cron;
        const jobs = jobOptions[key].jobs;
        schedule.scheduleJob(cron, function () {
            jobs.forEach((job: any) => {
                job();
            });
        });
    });
}
