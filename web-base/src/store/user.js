/** 用户全局数据 */

import { defineStore } from 'pinia';
import allStorage from '@/action/storageManage';

export const userDataStore = defineStore('userDataStore', {
    state: () => {
        const userStorage = allStorage.userStorage();
        /** 校验数据 */
        let userInfo = userStorage.value;
        if (typeof userInfo !== 'object') {
            userInfo = {};
        }
        return {
            userInfo: userInfo || {}, //当前登录用户的基础数据
            userMenuConfigMap: [], //已经拥有的系统目录map(使用obj充当map，更方便操作),包含配置信息，可以是path，name，用来判断用户是否拥有页面权限
            userMenuList: [], //用于展示的菜单列表，结构树形化
            permissionList: [], //权限字符串，根据该字符串可判断按钮权限
            tagList: [], // 页面标签列表
            iframeList: [], //iframe 数组，iframe也属于标签，跟标签挂钩
        };
    },
    getters: {},
    actions: {
        setUserInfo(value) {
            this.userInfo = value || {};
            /** 存入缓存 */
            const userStorage = allStorage.userStorage();
            userStorage.value = value;
        },
        setUserMenuConfigMap(value) {
            this.userMenuConfigMap = value || '';
        },
        setUserMenuList(value) {
            this.userMenuList = value || [];
        },
        setPermissionList(value) {
            this.permissionList = value || [];
        },
        setTagList(value) {
            this.tagList = value || [];
        },
        setIframeList(value) {
            this.iframeList = value || [];
        },
    },
});
