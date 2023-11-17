/** 公共全局数据 */

import { defineStore } from 'pinia';

export const publicData = defineStore('publicData', {
    state: () => {
        return {
            friendLinkList:[],  //友情链接
            iframeList:[],  //iframe 数组
        };
    },
    getters: {  },
    actions: {
        setFriendLinkList(value){
            this.friendLinkList = value || [];
        },
        setIframeList(value){
            this.iframeList = value || [];
        },
    },
});