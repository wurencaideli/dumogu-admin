/** 用户全局数据 */

import { defineStore } from 'pinia';
import allStorage from "@/common/StorageManage";


export const userData = defineStore('userData', {
    state: () => {
        const userStorage = allStorage.userStorage();
        /** 校验数据 */
        let userInfo = userStorage.value;
        if(typeof userInfo !== 'object'){
            userInfo = {};
        }
        return {
            userInfo:userInfo || {},
            token:userInfo.token || '',
            menuList:[],  //用户菜单列表
        };
    },
    getters: {  },
    actions: {
        setUserInfo(value){
            this.userInfo = value || {};
            userStorage.value = value;
        },
        setToken(value){
            this.token = value || '';
        },
    },
});