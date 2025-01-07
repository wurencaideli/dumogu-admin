/**
 * 环境变量
 */
export const env = {
    /** @type {'production' | 'development'} */
    MODE: import.meta.env.MODE,
    APP_name: import.meta.env.VITE_APP_name,
    APP_content: import.meta.env.VITE_APP_content,
    /** 请求的base api */
    APP_baseApiURL: import.meta.env.VITE_APP_baseApiURL,
    /** 路由的base api */
    APP_routeBasePath: import.meta.env.VITE_APP_routeBasePath,
}

export function isProduction(){
    return env.MODE == 'production';
}

export function isDevelopment(){
    return env.MODE == 'development';
}