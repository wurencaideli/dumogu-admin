/** 公共全局数据 */

import { defineStore } from 'pinia';

export const publicData = defineStore('publicData', {
    state: () => {
        return {
            activeType:'',  //当前显示的类型
        };
    },
    getters: {  },
    actions: {
        setFriendLinkList(value){
            this.friendLinkList = value || [];
        },
        setActiveType(value){
            this.activeType = value || '';
        },
    },
});