/**
 * 公用的一些函数
 */

/**
 * 是否是生产环境
 * @returns {string}
 */
function isPro() {
    return process.env.NODE_ENV === 'production';
}
/**
 * 获取数据的类型
 * @param {*} value
 * @returns {string}
 */
function getValueType(value) {
    return Object.prototype.toString.call(value);
}
/** 随机获取一个元素 */
function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
/** 格式化数字 */
function formatToK(value) {
    function roundToTwo(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
    // 只有当值大于300时才进行转换
    if (value > 300) {
        // 将数字转换为以“千”为单位
        const roundedValue = value / 1000;
        // 如果结果是整数，则省略“.0”，直接添加“k”
        return roundedValue === Math.floor(roundedValue)
            ? `${roundedValue}k`
            : `${roundToTwo(roundedValue)}k`;
    }
    // 如果值不大于300，直接返回原值
    return value.toString();
}

module.exports = {
    isPro,
    getRandomElement,
    formatToK,
    getValueType,
};
