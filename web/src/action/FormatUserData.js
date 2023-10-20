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
        let menuList = [
            {
                name:"main-index",
                title:'首页',
                isCache:true,
            },
            {
                name:"show-list",
                title:'标签一1',
            },
            {
                name:"show-list-info",
                title:'标签一6',
                path:'/main/show-list/info/wwer233',
            },
        ];
        menuList = menuMapping(menuList);
        /** 写入菜单数据 */
        userDataStore.setMenuList(menuList);
        userDataStore.setShowMenuList(menuList);
        /** 写入权限数据 */
    });
}