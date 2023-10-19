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
            menuList:[
                {
                    path:'/main/index',
                    title:'标签一',
                },
                {
                    path:'/main/show-list',
                    title:'标签一1',
                },
                {
                    path:'/main/show-list/info/12',
                    title:'标签一2',
                },
                {
                    path:'/main/show-list/info/123',
                    title:'标签一3',
                },
                {
                    path:'/main/show-list/info/12323',
                    title:'标签一4',
                },
                {
                    path:'/main/show-list/info/wwer233',
                    title:'标签一5',
                },
                {
                    path:'/main/show-list/info/wwer233',
                    title:'标签一5',
                },
                {
                    path:'/main/show-list/info/wwer2332',
                    title:'标签一6',
                },
            ],  //用户菜单列表
            tagList:[  //标签列表
                {
                    path:'/main/index',
                    title:'标签一',
                    sign:'/main/index',
                    fullPath:'/main/index',
                    isCache:true,
                },
                {
                    path:'/main/show-list',
                    title:'标签一1',
                    sign:'/main/show-list',
                    fullPath:'/main/show-list',
                },
                {
                    path:'/main/show-list/info/12',
                    title:'标签一2',
                    sign:'/main/show-list/info/12',
                    fullPath:'/main/show-list/info/12?name=1',
                },
                {
                    path:'/main/show-list/info/123',
                    title:'标签一3',
                    sign:'/main/show-list/info/123',
                    fullPath:'/main/show-list/info/123?name=1',
                },
                {
                    path:'/main/show-list/info/12323',
                    title:'标签一4',
                    sign:'/main/show-list/info/12323',
                    fullPath:'/main/show-list/info/12323?name=1',
                    isCache:true,
                },
                {
                    path:'/main/show-list/info/wwer233',
                    title:'标签一5',
                    sign:'/main/show-list/info/wwer233',
                    fullPath:'/main/show-list/info/wwer233?name=1',
                    isCache:true,
                },
            ],
            activeSign:'/main/index',
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
        setMenuList(value){
            this.menuList = value || [];
        },
        setTagList(value){
            this.tagList = value || [];
        },
        setActiveSign(value){
            this.activeSign = value || '';
        },
    },
});