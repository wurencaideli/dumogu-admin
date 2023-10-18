/*jshint esversion: 9 */
/**
 * http请求配置
 */
import axios from "axios";
import Const from "./Const";
import {userData as userDataStore} from "@/store/user";
import { ElMessageBox } from 'element-plus';
import {
    messageSuccess,
    messageError,
} from "@/common/MessagePrompt";
import router from '@/router';

export const service = axios.create({  //可创建多个 axios实例
    baseURL: Const.baseApiURL, //设置公共的请求前缀
    timeout: Const.timeout, //超时终止请求
});

service.interceptors.request.use(
    config => {
        const userData = userDataStore();
        config.headers = config.headers || {};
        config.headers['token'] = userData.token;
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
    response => {
        const data = response.data;
        if(!data){
            return Promise.reject({
                msg: '请求发生错误',
            });
        }
        const status = data.status;
        switch (status) {
            case 200:
                return data;
            case 401: //表示需要重新登录
                if(!modelShow){
                    modelShow = true;
                    ElMessageBox.confirm(
                        '登录已经失效，是否重新登录？',
                        '登录失效',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                        },
                    )
                    .then(() => {
                        router.push({
                            path:'/login',
                        });
                    }).catch(()=>{}).finally(()=>{
                        modelShow = false;
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
    () => { //数据请求发生错误
        return Promise.reject({
            msg: '请求发生错误，请稍后再试',
        });
    },
);