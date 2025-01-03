/**
 * 公共的返回体
 * 处理返回国际化
 */
const { transformLang } = require('../i18/index');

/**
 * 公共的json返回体
 * 枚举状态码
 * 200 请求成功
 * 202 已知的错误
 * 203 访问拦截错误
 * 401 凭证失效，需要重新获取
 * 500 系统错误
 *  */
class publicReturn {
    constructor(status, msg, data) {
        this.status = status;
        /** 如果msg是一个对象的话，调用国际化进行统一处理 */
        if(typeof msg == 'object'){
            let lang = msg.lang;
            msg = msg.msg || '';
            msg = msg.split('<i-s>');  // 表示国际化的分组转换的特定标识
            msg = transformLang(msg,lang);
        }
        this.msg = msg;
        this.data = data;
    }
}

module.exports = {
    publicReturn,
};
