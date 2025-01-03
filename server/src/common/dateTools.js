/*
 * 用于处理时间的工具，一篇文字
 */
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

/** 
 * 根据字符串生成格式化时间 参数："YYYY-MM-DD HH:mm:ss SSS"
 * @param {string} fmt 
 * @returns {string}
 */
function getFormatDate(fmt) {
    return dayjs().format(fmt);
}
/**
 * 将时间字符串转化为时间戳
 * @param {string} timeStr 
 * @returns {string}
 */
function strToTimestemp(timeStr) {
    const date = new Date(timeStr);
    return date.getTime();
}
/**
 * 将时间戳转化为字符格式的时间
 * @param {string} timestamp 
 * @param {string} timeStr 
 * @returns {string}
 */
function timestempToStr(timestamp, timeStr) {
    return dayjs(timestamp).format(timeStr);
}
/**
 * 验证时间格式是否正确，date的格式是否是format
 * date :2022-12-12-03-04-130
 * format :YYYY-MM-DD-HH-mm-ss-SSS
 * @param {string} date 
 * @param {string} format 
 * 返回一个dayjs实例，可以调用valueOf()获取时间戳
 */
function validDateFormat(date, format) {
    const dayjsObject = dayjs(date, format, true);
    /** 判断时间字符串是否符合规定 */
    if (dayjsObject.isValid() && dayjsObject.format(format) === date) {
        // 获取 Unix 时间戳（毫秒）
        return dayjsObject;
    } else {
        return false;
    }
}

module.exports = {
    getFormatDate,
    strToTimestemp,
    timestempToStr,
    validDateFormat,
};
