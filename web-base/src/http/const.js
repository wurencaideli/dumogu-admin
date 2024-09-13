/*jshint esversion: 9 */

const timeout = 13000; //api请求超时时间
let baseApiURL = import.meta.env.VITE_APP_baseApiURL; //api原始链接

export default {
    baseApiURL,
    timeout,
};
