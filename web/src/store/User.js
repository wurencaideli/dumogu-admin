/** 用户全局数据 */

import { defineStore } from 'pinia';
import allStorage from "@/action/StorageManage";

export const userData = defineStore('userData', {
    state: () => {
        const userStorage = allStorage.userStorage();
        const tagListStorage = allStorage.tagListStorage();
        /** 校验数据 */
        let userInfo = userStorage.value;
        if(typeof userInfo !== 'object'){
            userInfo = {};
        }
        let tagList = tagListStorage.value;
        if(!Array.isArray(tagList)) {
            tagList = [];
        }
        return {
            userInfo:userInfo || {},  //当前登录用户的基础数据
            hasSysMenuConfigMap:[],  //已经拥有的系统目录map,包含配置信息，可以是path，name
            showMenuList:[],  //用于展示的菜单列表，结构树形化
            tagList:tagList,  //标签列表
            tagHisList:[],  //标签历史列表，记录标签历史添加列表
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
        setHasSysMenuConfigMap(value){
            this.hasSysMenuConfigMap = value || '';
        },
        setShowMenuList(value){
            this.showMenuList = value || [];
        },
        setTagList(value){
            this.tagList = value || [];
            /** 存入缓存 */
            const tagListStorage = allStorage.tagListStorage();
            tagListStorage.value = value;
        },
        setTagHisList(value){
            this.tagHisList = value || [];
        },
        setActiveSign(value){
            this.activeSign = value || '';
        },
        setPermissionList(value){
            this.permissionList = value || '';
        },
    },
});