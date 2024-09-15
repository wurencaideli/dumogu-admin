/** 公共全局数据 */

import { defineStore } from 'pinia';

export const publicDataStore = defineStore('publicDataStore', {
    state: () => {
        return {
            friendLinkList: [], //友情链接
        };
    },
    actions: {
        setFriendLinkList(value) {
            this.friendLinkList = value || [];
        },
    },
});
