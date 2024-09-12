/*jshint esversion: 9 */
/**
 * 简单动画，使用requestAnimationFrame每帧执行
 */
class Task {
    constructor(fn) {
        Task.symbolNumber = Task.symbolNumber || 0; //计数器，用来区分
        Task.symbolNumber++;
        this.func = fn;
        this.symbol = Symbol(Task.symbolNumber);
        if (typeof this.func === 'function') {
            this.func(); //首次执行
        }
    }
}
const instanceList = []; //控制器实例列表
export class TaskControl {
    //任务控制器
    constructor() {
        this.taskList = [];
        this.symbolIndex = {}; //标记索引
        instanceList.push(this);
    }
    /**
     * 添加一个任务
     */
    add(fn) {
        const task = new Task(fn);
        this.taskList.push(task);
        this.symbolIndex[task.symbol] = task;
        return task.symbol;
    }
    /**
     * 清除一个任务
     */
    clear(symbol) {
        const task = this.symbolIndex[symbol];
        if (!task) return;
        delete this.symbolIndex[symbol];
        this.taskList.splice(this.taskList.indexOf(task));
        return task.func;
    }
    /**
     * 清除所有任务
     */
    clearAll() {
        this.taskList = [];
        this.symbolIndex = {};
    }
}
/**
 * 开始执行，每一帧都执行
 */
if (typeof requestAnimationFrame != 'undefined') {
    requestAnimationFrame(function func() {
        instanceList.forEach((instance) => {
            const taskList = instance.taskList;
            taskList.forEach((task) => {
                let fn = task.func;
                if (typeof fn !== 'function') return;
                fn();
            });
        });
        requestAnimationFrame(func);
    });
}
