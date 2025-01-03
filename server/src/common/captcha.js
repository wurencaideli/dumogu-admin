/** 验证码验证工具 */
const uuidTools = require('../common/uuidTools');
const svgCaptcha = require('svg-captcha');

const captchaMap = new Map();
/**
 * 创建一个验证码
 * @returns {{svg:string,id:string}} 返回数据对象
 */
function create() {
    let captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: 'O0o1iIl', //不需要的字符
        noise: 20,
        color: true,
        background: '#cc9966',
    });
    const uuid = uuidTools.createUuid();
    captchaMap.set(uuid, {
        id: uuid,
        text: captcha.text.toLowerCase(), //转小写
        overtime: new Date().getTime() + 1000 * 60 * 7, //过期时间  7分钟
    });
    return {
        svg: captcha.data,
        id: uuid,
    };
}
/**
 * 验证，不考虑验证码过期
 * @param {string} id
 * @param {string} text
 * @returns {boolean}
 *  */
function verify(id, text) {
    const p = captchaMap.get(id);
    if (!p) return false;
    text = text + '';
    text = text.toLowerCase(); //转小写
    if (p.text !== text) return false;
    captchaMap.delete(id);
    return true;
}
/**
 * 清除已过期的
 * 由外部的定时任务清除
 */
function verifyOverTime() {
    const nowDate = new Date().getTime();
    captchaMap.forEach((item) => {
        if (item.overtime >= nowDate) return;
        captchaMap.delete(item.id);
    });
}

module.exports = {
    create,
    verify,
    verifyOverTime,
};
