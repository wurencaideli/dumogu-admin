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
            userInfo:userInfo || {},  //当前登录用户的基础数据
            menuList:[],  //用户菜单列表
            showMenuList:[],  //用于展示的菜单列表，结构树形化
            tagList:[],  //标签列表
            activeSign:'',  //当前活动的标签唯一标识
            permissionList:[],  //权限字符串，柑橘该字符串可判断按钮权限
        };
    },
    getters: {  },
    actions: {
        setUserInfo(value){
            this.userInfo = value || {};
            /** 存入缓存 */
            const userStorage = allStorage.userStorage();
            userStorage.value = value;
        },
        setMenuList(value){
            this.menuList = value || [];
        },
        setShowMenuList(value){
            this.showMenuList = value || [];
        },
        setTagList(value){
            this.tagList = value || [];
        },
        setActiveSign(value){
            this.activeSign = value || '';
        },
        setPermissionList(value){
            this.permissionList = value || '';
        },
    },
});