/*jshint esversion: 9 */
/**
 * http请求配置
 */
import axios from 'axios';
import { userDataStore } from '@/store/user';
import router from '@/router';
import { Modal } from 'ant-design-vue';

let baseApiURL = import.meta.env.VITE_APP_baseApiURL; //api原始链接
const timeout = 13000; //api请求超时时间

export const service = axios.create({
    //可创建多个 axios实例
    baseURL: baseApiURL, //设置公共的请求前缀
    timeout: timeout, //超时终止请求
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
                    Modal.confirm({
                        title: '登录已经失效，是否重新登录？',
                        content: '登录失效',
                        onOk() {
                            userData.setUserInfo({});
                            router.push('/login');
                            modelShow = false;
                        },
                        onCancel() {
                            modelShow = false;
                        },
                    });
                }
                return Promise.reject(data);
            case 202: //表示失败，参数或其他原因
                return Promise.reject(data);
            case 500: //表示报错。未知原因
                return Promise.reject(data);
            default:
                return Promise.reject(data);
        }
    },
    () => {
        //数据请求发生错误
        return Promise.reject({
            msg: '请求发生错误，请稍后再试',
        });
    },
);
