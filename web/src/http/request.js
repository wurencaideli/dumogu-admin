import axios from 'axios';

import { userDataStore } from '@/store/user.js';
import { confirm } from '@/action/message-prompt.js';
import router from '@/router/index.js';
import { env } from '@/env.js';

export const service = axios.create({
    baseURL: env.APP_baseApiURL,
    timeout: 13000,
});

service.interceptors.request.use(
    (config) => {
        const userData = userDataStore();
        config.headers = config.headers || {};
        config.headers['token'] = userData.userInfo.token;
        return config;
    },
    () => {
        return Promise.reject({
            msg: '请求发生错误，请稍后再试',
        });
    },
);
let modelShow = false;
service.interceptors.response.use(
    (response) => {
        const data = response.data;
        if (!data) {
            return Promise.reject({
                msg: '请求发生错误',
            });
        }
        const status = data.status;
        switch (status) {
            case 200:
                return data;
            case 401: //表示需要重新登录
                if (!modelShow) {
                    modelShow = true;
                    confirm('登录已经失效，是否重新登录？', '登录失效', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                        .then(() => {
                            router.push({
                                path: '/login',
                            });
                        })
                        .catch(() => {})
                        .finally(() => {
                            modelShow = false;
                        });
                }
                return Promise.reject(data);
            case 202:
                return Promise.reject(data);
            case 500:
                return Promise.reject(data);
            default:
                return Promise.reject(data);
        }
    },
    () => {
        return Promise.reject({
            msg: '请求发生错误，请稍后再试',
        });
    },
);
