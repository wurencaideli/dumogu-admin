import { transformLang } from '../i18/index';

export class ResBody {
    /**
     * 状态码
     * 200 请求成功
     * 202 已知的错误
     * 203 访问拦截错误
     * 401 凭证失效，需要重新获取
     * 404 找不到资源
     * 500 系统错误
     * @type {200|202|203|401|404|500}
     */
    status;

    /** @type {string} 消息 */
    msg = '';

    /** @type {any} 数据 */
    data;

    /**
     * @param {ResBody['status']} status 
     * @param {string|{msg: string;lang: string}} msg 
     * @param {*} data 
     */
    constructor(status, msg, data) {
        this.status = status;
        /** 如果msg是一个对象的话，调用国际化进行统一处理 */
        if (typeof msg == 'object') {
            this.msg = transformLang((msg.msg || '').split('<i-s>'), msg.lang);
        } else {
            this.msg = msg;
        }
        this.data = data;
    }
}