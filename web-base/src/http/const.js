/*jshint esversion: 9 */
import dumoguConfig from '@/dumogu.config.js';

const timeout = 13000; //api请求超时时间
let baseApiURL = dumoguConfig.baseApiURL; //api原始链接

export default {
    baseApiURL,
    timeout,
};
