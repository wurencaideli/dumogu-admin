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

/** 
 * 转换用户menu
 * 目的是分出用于显示的和用户判断目录权限的
 * 用于判断权限的包含配置信息
 *  */
function transUserMenu(menuList){
    let hasSysMenuConfigMap = {};
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
        /** 根据目录配置找到对应的系统menu */
        /** 有路由地址，但没菜单名称 */
        if(item.path && !item.name) {
            let sysMenu = sysMeluPathMap[item.path] || {};
            item.name = sysMenu.name;
        };
        /** 没路由地址，但有菜单名称 */
        if(!item.path && item.name) {
            let sysMenu = sysMeluNameMap[item.name] || {};
            item.path = sysMenu.path;
        };
        /** 
         * 添加权限，添加已有的权限列表
         * 因为path属于name的子集，所哟name,path都应该有自己的配置
         *  */
        if(item.name){
            hasSysMenuConfigMap[item.name] = item;
        }
        if(item.path){
            hasSysMenuConfigMap[item.path] = item;
        }
        /** 有唯一标识的也添加，方便查找，可以替换一些信息 */
        if(item.sign){
            hasSysMenuConfigMap[item.sign] = {
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
        hasSysMenuConfigMap,
    };
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
            "userName": "admin",
            "nickName": "管理员",
            "avatar":'https://cn.bing.com/th?id=OHR.AdelieWPD_ZH-CN8434233391_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp',
        });
        /** 
         * 用户目录列表
         * name表示对应的系统目录，有name才有此系统目录的权限
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
                content:'(有缓存，并且标签页固定)',
                isCache:true,
                fixed:true,
                iconName:"all-fill",
            },
            {
                title:'系统管理',
                iconName:"cog-fill",
                childs:[
                    {
                        name:"menu",
                        title:'菜单管理',
                        isCache:true,
                        content:'用户目录配置',
                        iconName:"alignleft-fill",
                        showTagIcon:true,
                    },
                    {
                        name:"bt-permission",
                        title:'按钮权限管理',
                        isCache:true,
                        content:'与菜单分开',
                        iconName:"borderverticle-fill",
                        showTagIcon:true,
                    },
                    {
                        name:"user-list",
                        title:'用户管理',
                        isCache:true,
                        content:'',
                        iconName:"user-fill",
                        showTagIcon:true,
                    },
                    {
                        name:"role-list",
                        title:'角色列表',
                        isCache:true,
                        content:'',
                        iconName:"user-group-fill",
                        showTagIcon:true,
                    },
                ],
            },
            {
                title:'站内链接',
                iconName:"aligncenter-fill",
                childs:[
                    {
                        path:'/main/iframe/https://www.dumogu.top/',
                        title:'一篇文字',
                        content:'有缓存',
                        iconName:"logo",
                        showTagIcon:true,
                        isCache:true,
                    },
                    {
                        path:'/main/iframe/https://blog.dumogu.top/',
                        title:'毒蘑菇 - 博客',
                        iconName:"logo",
                        showTagIcon:true,
                        isCache:false,
                    },
                    {
                        path:'/main/iframe/https://cn.vuejs.org/guide/introduction.html',
                        title:'VUE3文档',
                        content:'有缓存',
                        iconName:"vue",
                        showTagIcon:true,
                        isCache:true,
                    },
                    {
                        path:'/main/iframe/https://www.amap.com/',
                        title:'高德地图',
                        content:'有缓存',
                        iconName:"gaode",
                        showTagIcon:true,
                        isCache:true,
                    },
                ],
            },
            {
                name:"show-list",
                title:'展示列表',
                iconName:"laptop-check",
                number:4,
            },
            {
                name:"other-view",
                title:'其他功能展示',
                iconName:"map-fill",
                isCache:true,
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
                content:'(有缓存)',
                iconName:"Navbar-full",
            },
            {
                title:'多级菜单',
                iconName:"alignleft-fill",
                childs:[
                    {
                        title:'可点击父级',
                        path:'/main/show-list/update/erterter',
                        iconName:"aligncenter-fill",
                        childs:[
                            {
                                name:"show-list-update",
                                path:'/main/show-list/update/123123',
                                title:'可点击父级',
                                iconName:"aligncenter-fill",
                                childs:[
                                    {
                                        name:"show-list-update",
                                        path:'/main/show-list/update/1231233',
                                        title:'数据编辑 - 测试',
                                        iconName:"test-1",
                                        showTagIcon:true,
                                    },
                                ],
                            },
                            {
                                title:'父级',
                                iconName:"aligncenter-fill",
                                childs:[
                                    {
                                        name:"show-list-update",
                                        path:'/main/show-list/update/1235123',
                                        title:'数据编辑 - 测试1',
                                        iconName:"plus-square-fill",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name:"icon-list",
                title:'icon 列表展示',
                isCache:true,
                content:'(有缓存)',
                // iconName:"collection-fill",
                iconName:"logo",
                showTagIcon:true,
                number:20,
            },
            {
                name:"mine",
                title:'个人中心',
                isCache:true,
                content:'(有缓存)',
                hidden:true,
                iconName:"Navbar-full",
            },
            {
                name:"setup-tag",
                title:'设置标签页',
                isCache:true,
                content:'(有缓存)',
                hidden:false,
                iconName:"tag",
            },
            {
                name:"setup-menu",
                title:'目录信息',
                isCache:true,
                content:'(有缓存)',
                hidden:false,
                iconName:"Directory-tree",
            },
            {
                title:'开源地址',
                iconName:"git-hub",
                isLink:true,
                path:'https://github.com/wurencaideli/dumogu-admin',
            },
            {
                title:'一篇文字',
                iconName:"friendship",
                isLink:true,
                path:'https://www.dumogu.top/',
            },
            {
                title:'毒蘑菇 - 博客',
                iconName:"friendship",
                isLink:true,
                path:'https://blog.dumogu.top/',
            },
            {
                title:'毒蘑菇 - 搜索',
                iconName:"friendship",
                isLink:true,
                path:'https://s.dumogu.top/',
            },
            {
                title:'毒蘑菇 - 变量',
                iconName:"friendship",
                isLink:true,
                path:'https://var.dumogu.top/',
            },
            {
                title:'站搜搜',
                iconName:"friendship",
                isLink:true,
                path:'https://www.zhansousou.com/',
            },
        ];
        let transData = transUserMenu(menuList);
        /** 写入展示菜单数据 */
        userDataStore.setShowMenuList(transData.showMenuList);
        /** 写入权限菜单数据 */
        userDataStore.setHasSysMenuConfigMap(transData.hasSysMenuConfigMap);
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
        userDataStore.setHasSysMenuConfigMap(transData.hasSysMenuConfigMap);
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
    userDataStore.setHasSysMenuConfigMap(transData.hasSysMenuConfigMap);
}
/** 
 * 用户退出登录
 * 清空用户数据
 */
export function logout(){
    const userDataStore = userData();
    userDataStore.setUserInfo({});
    userDataStore.setShowMenuList([]);
    userDataStore.setHasSysMenuConfigMap({});
    userDataStore.setTagList([]);
    userDataStore.setActiveSign('');
}