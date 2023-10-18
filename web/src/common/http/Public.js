/*jshint esversion: 9 */
import {
    service,
} from "./Request";
import qs from 'qs';

/** 公用接口 */
const allApi = {
    getCaptcha(){
        return service({
            url:"/public/captcha",
            method:'get',
        });
    },
    getBingTody(){
        return service({
            url:"/public/bing-today",
            method:'get',
        });
    },
    getBingHistory(params){
        return service({
            url:"/public/bing-history",
            method:'get',
            params,
        });
    },
    getWallHavenTody(){
        return service({
            url:"/public/wall-haven-today",
            method:'get',
        });
    },
    getWallHavenInfo(params){
        return service({
            url:"/public//wall-haven-info",
            method:'get',
            params,
        });
    },
    getWallHavenHistory(params){
        return service({
            url:"/public//wall-haven-history",
            method:'get',
            params,
        });
    },
};

export default allApi;