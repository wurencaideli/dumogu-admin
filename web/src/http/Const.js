/*jshint esversion: 9 */
import {isProdoction} from '@/common/OtherTools';
import dumoguConfig from '@/config.js';

const timeout = 13000;  //api请求超时时间
let baseApiURL = dumoguConfig.baseApiURL;  //api原始链接
// if(isProdoction()){  //如果是生产环境
//     baseApiURL = 'https://s.dumogu.top/api';
// }else{
//     baseApiURL = '/api';
// }
export default{
    baseApiURL,
    timeout,
};