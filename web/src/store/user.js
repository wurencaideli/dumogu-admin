/** 用户全局数据 */

import { defineStore } from 'pinia';
import allStorage from '@/action/storageManage';

const tagListStorage = allStorage.tagListStorage();
const userStorage = allStorage.userStorage();
export const userDataStore = defineStore('userDataStore', {
    state: () => {
        /** 校验数据 */
        let userInfo = userStorage.value;
        if (typeof userInfo !== 'object') {
            userInfo = {};
        }
        /**
         * 优先使用缓存中的数据
         */
        let tagList = tagListStorage.value;
        if (!Array.isArray(tagList)) {
            tagList = [];
        }
        return {
            userInfo: userInfo || {}, //当前登录用户的基础数据
            userMenuConfigNameMap: {}, //用户自定义的目录name配置（有该配置表示拥有该目录权限）
            userMenuConfigPathMap: {}, //用户自定义的目录path配置（有该配置表示拥有该目录权限）
            userMenuSignMap: {}, //目录的唯一标识map，方便查找
            userMenuList: [], //用于展示的菜单列表，结构树形化
            permissionList: [], //权限字符串，根据该字符串可判断按钮权限
            tagList: tagList, // 页面标签列表
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
        setUserMenuConfigNameMap(value) {
            this.userMenuConfigNameMap = value || {};
        },
        setUserMenuConfigPathMap(value) {
            this.userMenuConfigPathMap = value || {};
        },
        setUserMenuSignMap(value) {
            this.userMenuSignMap = value || {};
        },
        setPermissionList(value) {
            this.permissionList = value || [];
        },
        setUserMenuList(value) {
            this.userMenuList = value || [];
        },
        setTagList(value) {
            this.tagList = value || [];
            /** 存入缓存 */
            tagListStorage.value = this.tagList;
        },
        setIframeList(value) {
            this.iframeList = value || [];
        },
    },
});
