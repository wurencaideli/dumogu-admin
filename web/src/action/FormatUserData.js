/** 
 * 格式化用户的一些数据
 * 在这里可以接口请求用户的一些数据
 */
import {userData} from "@/store/User";
import {
    sysMeluNameMap,
    sysMeluPathMap,
} from "@/router/Common";
import {toTree,unfoldTreeList} from "@/common/MenuTools";
import {guid} from "@/common/Guid";
import mainTagDataStore from "@/layout/main/common/TagData";
import userApi from "@/http/User";

/** 
 * url 转 path
 * 防止链接带参数时的一些匹配错误
 */
function urlToPath(url){
    try {
        return new URL(location.origin + url).pathname;
    } catch {
        return url;
    }
}
/** 
 * 转换用户menu
 * 目的是分出用于显示的和用户判断目录权限的
 * 用于判断权限的包含配置信息
 *  */
function transUserMenu(menuList){
    let hasSysMenuConfigObj = {};
    let showMenuList = [];
    /** 
     * 将树形结构展开
     * 需要换成一维数组来过滤不要展示的目录
     *  */
    menuList = unfoldTreeList(menuList,{
        childsKey:'childs',
        setParentKey:'parentSign',
        getParentKey:'sign',
        forEachFn(item){
            /** 添加唯一标识以便区分 */
            item.sign = guid();
        },
    });
    menuList.forEach(item=>{
        /** 
         * 根据目录配置找到对应的系统menu
         * 添加权限，添加已有的权限列表
         * 因为path属于name的子集，所以name,path都应该有自己的配置
         * 赋予正确的名称，并添加以path为优先，name次之的权限
         *  */
        let path = item.path;
        let name = item.name;
        if(!!path && !name) {
            /** 
             * 有路由地址，但没菜单名称
             *  */
            path = urlToPath(path);
            let sysMenu = sysMeluPathMap[path] || {};
            item.name = sysMenu.name;
            hasSysMenuConfigObj[path] = item;
        }
        if(!path && !!name) {
            /** 没路由地址，但有菜单名称 */
            let sysMenu = sysMeluNameMap[name] || {};
            item.path = sysMenu.path;
            hasSysMenuConfigObj[name] = item;
        }
        if(!!path && !!name) {
            /** 
             * 有路由地址，有菜单名称
             * 以路由为准
             *  */
            path = urlToPath(path);
            hasSysMenuConfigObj[path] = item;
        }
        /** 有唯一标识的也添加，方便查找，可以替换一些信息 */
        if(!!item.sign){
            hasSysMenuConfigObj[item.sign] = {
                ...item,
            };
        }
    });
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
    return {
        showMenuList,
        hasSysMenuConfigObj,
    };
}
/** 
 * 获取用户详细数据
 */
export function getUserData(){
    return Promise.resolve().then(async ()=>{
        const userDataStore = userData();
        let userInfo = userDataStore.userInfo || {};
        /** 获取用户信息 */
        let userInfo_ = await userApi.getUserInfo().then(res=>{
            return res.data || {};
        }).catch(()=>{
            return {};
        });
        /** 写入基本信息  */
        userDataStore.setUserInfo({
            ...userInfo,
            ...userInfo_,
        });
        /** 
         * 获取用户目录列表
         * name表示对应的系统目录，有name才有此系统目录的权限
         * 有path的可直接跳转
         * 没path的，根据name获取映射的系统菜单属性进行跳转
         * isCache 表示该页面是否缓存
         * hidden 表示该页面是否在左边目录上显示
         * isLink 表示直接跳转新页面
         *  */
        let menuList = await userApi.getMenuList().then(res=>{
            return res.data || {};
        }).catch(()=>{
            return [];
        });
        let transData = transUserMenu(menuList);
        /** 写入展示菜单数据 */
        userDataStore.setShowMenuList(transData.showMenuList);
        /** 写入权限菜单数据 */
        userDataStore.setHasSysMenuConfigObj(transData.hasSysMenuConfigObj);
    });
}
/** 
 * 获取用户详细数据
 */
export function getUserData_1(){
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
                isCache:false,
                iconName:"all-fill",
                number:23,
            },
            {
                name:"icon-list",
                title:'icon 列表展示',
                fixed:true,
                isCache:true,
                content:'(有缓存，并且标签页固定)',
                iconName:"collection-fill",
                number:10,
            },
            {
                name:"show-list",
                title:'展示列表',
                iconName:"laptop-check",
                number:2,
            },
            {
                name:"user-list",
                title:'用户列表',
                isCache:false,
                iconName:"database",
            },
            {
                name:"setup-tag",
                title:'设置标签页',
                hidden:false,
                iconName:"tag",
            },
            {
                name:"setup-menu",
                title:'目录信息 - 更新版',
                isCache:false,
                hidden:false,
                iconName:"Directory-tree",
            },
        ];
        let transData = transUserMenu(menuList);
        /** 写入展示菜单数据 */
        userDataStore.setShowMenuList(transData.showMenuList);
        /** 写入权限菜单数据 */
        userDataStore.setHasSysMenuConfigObj(transData.hasSysMenuConfigObj);
    });
}
/** 
 * 写入目录信息
 * 由外部指定
 *  */
export function setMenuData(treeList){
    const userDataStore = userData();
    let menuList = treeList;
    let transData = transUserMenu(menuList);
    /** 写入展示菜单数据 */
    userDataStore.setShowMenuList(transData.showMenuList);
    /** 写入权限菜单数据 */
    userDataStore.setHasSysMenuConfigObj(transData.hasSysMenuConfigObj);
}
/** 
 * 用户退出登录
 * 清空用户数据
 */
export function logout(){
    const userDataStore = userData();
    userDataStore.setUserInfo({});
    userDataStore.setShowMenuList([]);
    userDataStore.setHasSysMenuConfigObj({});
    mainTagDataStore.setTagList([]);
    mainTagDataStore.setActiveSign('');
}