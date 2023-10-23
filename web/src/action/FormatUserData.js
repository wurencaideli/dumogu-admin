/** 
 * 格式化用户的一些数据
 * 在这里可以接口请求用户的一些数据
 */
import {userData} from "@/store/User";
import userApi from '@/http/User.js';
import {sysMeluNameMap} from "@/router/Common";
import {toTree,unfoldTreeList} from "@/common/MenuTools";
import {guid} from "@/common/Guid";

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
         * isLink 表示直接跳转新页面
         *  */
        let menuList = [
            {
                name:"main-index",
                title:'首页',
                isCache:true,
                fixed:true,
                iconName:"all-fill",
            },
            {
                name:"show-list",
                title:'展示列表',
                iconName:"dingwei",
            },
            {
                name:"show-list-info",
                title:'数据详情',
                hidden:true,
                iconName:"all-fill",
            },
            {
                name:"show-list-add",
                title:'数据添加',
                hidden:true,
                iconName:"Navbar-full",
            },
            {
                name:"show-list-update",
                title:'数据编辑',
                hidden:true,
                isCache:true,
                iconName:"Navbar-full",
            },
            {
                name:"user-list",
                title:'用户列表',
                isCache:true,
                iconName:"Navbar-full",
            },
            {
                name:"role-list",
                title:'角色列表',
                iconName:"xihuan",
                childs:[
                    {
                        name:"show-list-update",
                        path:'/main/show-list/update/asdasd12',
                        title:'数据编12312',
                        childs:[
                            {
                                name:"show-list-update",
                                path:'/main/show-list/update/asdasd12123',
                                title:'数据编辑 - 123',
                                iconName:"Navbar-full",
                            },
                        ],
                    },
                ],
            },
            {
                name:"icon-list",
                title:'icon 列表展示',
                isCache:true,
                iconName:"Navbar-full",
            },
            {
                name:"mine",
                title:'个人中心',
                isCache:true,
                hidden:true,
                iconName:"Navbar-full",
            },
        ];
        /** 
         * 将树形结构展开
         * 因为menuList 会用来判断是否有权限查看页面，用一维数组比较好判断
         * 而且还要过滤不要展示的目录
         *  */
        menuList = unfoldTreeList(menuList,{
            childsKey:'childs',
            setParentKey:'parentSign',
            getParentKey:'sign',
            forEachFn(item){
                /** 添加标识以便区分 */
                item.sign = guid();
            },
        });
        menuList = menuMapping(menuList);
        /** 写入菜单数据 */
        userDataStore.setMenuList(menuList);
        let showMenuList = [];
        showMenuList = menuList.filter(item=>!item.hidden);
        showMenuList = toTree(showMenuList.map(item=>{
            delete item.childs;
            return item;
        }),{
            pKey:'parentSign',
            key:'sign',
            childsKey:'childs',
            isNew:true,
        });
        userDataStore.setShowMenuList(showMenuList);
        /** 写入权限数据 */
    });
}
/** 
 * 用户退出登录
 * 清空用户数据
 */
export function logout(){
    const userDataStore = userData();
    userDataStore.setUserInfo({});
    userDataStore.setMenuList([]);
    userDataStore.setShowMenuList([]);
    userDataStore.setTagList([]);
    userDataStore.setActiveSign('');
}