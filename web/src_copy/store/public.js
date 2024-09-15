/** 公共全局数据 */

import { defineStore } from 'pinia';
import allStorage from '@/action/storageManage';

export const publicDataStore = defineStore('publicDataStore', {
    state: () => {
        const showMenuStorage = allStorage.showMenuStorage(true);
        let showMenu = !!showMenuStorage.value;
        return {
            friendLinkList: [], //友情链接
            showMenu: showMenu, //是否显示目录
        };
    },
    getters: {},
    actions: {
        setFriendLinkList(value) {
            this.friendLinkList = value || [];
        },
        setShowMenu(value) {
            this.showMenu = !!value;
            /** 存入缓存 */
            const showMenuStorage = allStorage.showMenuStorage(true);
            showMenuStorage.value = this.showMenu;
        },
    },
});
