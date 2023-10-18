/*jshint esversion: 9 */
/*
 * 用于处理时间的工具，一篇文字
 */

/**
 * 
 * 时间格式化 参数:毫秒级时间戳 number
 */
export function formatDateByTimestamp(timestamp) {
    // 补全为13位
    var arrTimestamp = (timestamp + '').split('');
    for (var start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
            arrTimestamp[start] = '0';
        }
    }
    timestamp = arrTimestamp.join('') * 1;
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - timestamp;

    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return '不久前';
    }
    // 计算差异时间的量级
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;

    // 数值补0方法
    var zero = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };

    // 使用
    if (monthC > 4) {
        // 超过1年，直接显示年月日
        return (function () {
            var date = new Date(timestamp);
            return date.getFullYear() + '-' + zero(date.getMonth() + 1) + '-' + zero(date.getDate());
        })();
    } else if (monthC >= 1) {
        return parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        return parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        return parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        return parseInt(minC) + "分钟前";
    }
    return '刚刚';
}