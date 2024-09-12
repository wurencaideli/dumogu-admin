/**
 * 毒蘑菇后台管理配置文件
 */
import { isProd } from '@/common/otherTools';

/** 开发环境配置 */
let configDev = {
    name: '毒蘑菇 - 后台管理',
    title: '最基础的管理端架子 - 毒蘑菇管理',
    baseApiURL: 'https://s.dumogu.top/api',
    routeBasePath: '/',
};

/** 生产环境配置 */
let configProd = {
    name: '毒蘑菇 - 后台管理',
    title: '最基础的管理端架子 - 毒蘑菇管理',
    baseApiURL: '/api',
    routeBasePath: '/',
};

let config = isProd ? configProd : configDev;

export default config;
