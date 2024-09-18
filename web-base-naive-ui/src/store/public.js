/** 公共全局数据 */

import { defineStore } from 'pinia';
import allStorage from '@/action/storageManage';

export const publicDataStore = defineStore('publicDataStore', {
    state: () => {
        const fullScreenStorage = allStorage.fullScreenStorage(false);
        return {
            friendLinkList: [], //友情链接
            fullScreen: fullScreenStorage.value, //是否内容全屏
        };
    },
    actions: {
        setFriendLinkList(value) {
            this.friendLinkList = value || [];
        },
        setFullScreen(value) {
            this.fullScreen = !!value;
            /** 存入缓存 */
            const fullScreenStorage = allStorage.fullScreenStorage();
            fullScreenStorage.value = this.fullScreen;
        },
    },
});
