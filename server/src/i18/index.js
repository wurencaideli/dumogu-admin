/**
 * 国际化方法
 */
const i18n = require('i18next');

/** 初始化实例 */
i18n.init({
    lng: 'zh', // 初始语言
    fallbackLng: 'zh',
    resources: {
        zh: {
            translation: {
                '什么也没找到': '什么也没找到',
            },
        },
        en: {
            translation: {
                '什么也没找到': 'Nothing was found',
            },
        },
    },
});
/**
 * 转换
 * @param {string | Array<string>} keys
 * @param {string} lang
 * @returns {string}
 */
function transformLang(keys, lang) {
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    keys = keys
        .map((key) => {
            return i18n.t(key, {
                lng: lang,
            });
        })
        .join('');
    return keys;
}
/**
 * 获取请求体中的语言参数
 * @param {*} req
 * @returns {string}
 */
function getReqlanguage(req) {
    if (req.__language__) return req.__language__;
    let language = (req.headers || {})['accept-language'] || '';  // 浏览器会自带此请求头，值: zh-CN,zh;q=0.9
    let languageS = language.split(',');
    if(languageS.length == 2){
        let languageS_ = languageS[1].split(';');
        if(languageS_.length == 2){
            language = languageS_[0];
        }
    }
    let queryLanguage = '';  // 请求携带的参数，优先使用
    if (req.method === 'GET') {
        queryLanguage = req.query.lang;
    }
    language = queryLanguage || language;
    language = language || 'zh';
    req.__language__ = language; // 防止做二次处理
    return language;
}
/**
 * 根据键和req直接返回国际化，相当于一个组合函数
 * @param {string | string[]} keys
 * @param {*} req
 * @returns {string}
 */
function getI18ByKeyAndReq(keys, req) {
    const lang = getReqlanguage(req);
    return transformLang(keys,lang);
}

module.exports = {
    i18n,
    transformLang,
    getReqlanguage,
    getI18ByKeyAndReq,
};
