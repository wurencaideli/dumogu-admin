/** 
 * 格式化用户的一些数据
 * 在这里可以接口请求用户的一些数据
 */
import {userData} from "@/store/user";
import userApi from '@/common/http/User.js';
import {sysMeluNameMap} from "@/router/Common";

/**
 * 目录映射
 * 将用户的配置目录和系统目录映射关系
 */ 
function menuMapping(menuList){
    menuList.forEach(item=>{
        if(item.path) return;
        item.path = (sysMeluNameMap[item.name] || {}).path || '';
    });
    return menuList;
}
/** 
 * 获取用户详细数据
 */
export function getUserData(){
    return Promise.resolve().then(()=>{
        const userDataStore = userData();
        let userInfo = userDataStore.userInfo || {};
        /** 写入基本信息  */
        userDataStore.setUserInfo({
            ...userInfo,
            "userId": "1",
            "userName": "admin",
            "nickName": "管理员",
            "email": "admin@163.com",
            "phonenumber": "15888888888",
            "admin": true,
        });
        /** 
         * 用户目录列表
         * 有path的可直接跳转
         * 没path的，根据name获取映射的系统菜单属性进行跳转
         * isCache 表示该页面是否缓存
         * hidden 表示该页面是否在左边目录上显示
         *  */
        let menuList = [
            {
                name:"main-index",
                title:'首页',
                isCache:true,
            },
            {
                name:"show-list",
                title:'展示列表',
            },
            {
                name:"show-list-info",
                title:'数据详情',
                hidden:true,
            },
            {
                name:"show-list-add",
                title:'数据添加',
                hidden:true,
            },
            {
                name:"show-list-update",
                title:'数据编辑',
                hidden:true,
                isCache:true,
            },
            {
                name:"user-list",
                title:'用户列表',
            },
            {
                name:"role-list",
                title:'角色列表',
            },
        ];
        menuList = menuMapping(menuList);
        /** 写入菜单数据 */
        userDataStore.setMenuList(menuList);
        let showMenuList = [];
        showMenuList = menuList.filter(item=>!item.hidden);
        userDataStore.setShowMenuList(showMenuList);
        /** 写入权限数据 */
    });
}