/** 公共全局数据 */

import { defineStore } from 'pinia';
import allStorage from "@/action/StorageManage";

export const publicData = defineStore('publicData', {
    state: () => {
        const showMenuStorage = allStorage.showMenuStorage(true);
        let showMenu = !!showMenuStorage.value;
        return {
            friendLinkList:[],  //友情链接
            iframeList:[],  //iframe 数组
            viewFullScreen:false,  //是否视图全屏
            showMenu:showMenu,  //是否显示目录
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
        setViewFullScreen(value){
            this.viewFullScreen = !!value;
        },
        setShowMenu(value){
            this.showMenu = !!value;
            /** 存入缓存 */
            const showMenuStorage = allStorage.showMenuStorage(true);
            showMenuStorage.value = this.showMenu;
        },
    },
});