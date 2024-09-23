/**
 * 格式化用户的一些数据
 * 在这里可以接口请求用户的一些数据
 */
import { userDataStore } from '@/store/user';
import { sysMeluConfigNameMap, sysMeluConfigPathMap } from '@/router/common';
import { toTree, unfoldTreeList } from '@/common/treeTools';
import { getNanoid } from '@/common/guid';
import { deepCopyObj } from '@/common/otherTools';
import userApi from '@/http/user';
import { formatTagsByUserMenuConfig } from '@/action/tagListTools';

/**
 * url 转 path
 * 防止链接带参数时的一些匹配错误
 */
function urlToPath(url) {
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
function transUserMenu(menuList) {
    let userMenuConfigNameMap = {};
    let userMenuConfigPathMap = {};
    let userMenuList = [];
    let userMenuSignMap = {};
    /**
     * 将树形结构展开
     * 需要换成一维数组来过滤不要展示的目录
     *  */
    menuList = unfoldTreeList(menuList, {
        childsKey: 'childs',
        setParentKey: 'parentSign',
        getParentKey: 'sign',
        forEachFn(item) {
            /** 添加唯一标识以便区分 */
            item.sign = getNanoid();
        },
    });
    /** 遍历用户目录，生成用户配置 */
    menuList.forEach((item) => {
        delete item.childs;
        /**
         * 根据用户自己的配置生成配置MAP
         * 添加以path为优先，name次之的配置信息（因为一个name路由可以产生多个path）
         *  */
        let path = item.path;
        let name = item.name;
        if (!!path && !name) {
            /** 有路由地址，但没目录名称 */
            path = urlToPath(path);
            userMenuConfigPathMap[path] = item;
        }
        if (!path && !!name) {
            /** 没路由地址，但有菜单名称 */
            let sysMenuConfig = sysMeluConfigNameMap[name] || {};
            item.path = sysMenuConfig.path;
            userMenuConfigNameMap[name] = item;
        }
        if (!!path && !!name) {
            /**
             * 有路由地址，有菜单名称
             * 以路由为准
             *  */
            path = urlToPath(path);
            userMenuConfigPathMap[path] = item;
        }
        userMenuSignMap[item.sign] = item;
    });
    /** 用作展示的目录可以过滤掉不显示的 */
    userMenuList = menuList.filter((item) => !item.hidden);
    userMenuList = toTree(userMenuList, {
        pKey: 'parentSign',
        key: 'sign',
        childsKey: 'childs',
        isNew: true,
    });
    return {
        userMenuList,
        userMenuConfigNameMap,
        userMenuConfigPathMap,
        userMenuSignMap,
    };
}
/**
 * 获取用户详细数据
 */
export function getUserData() {
    return Promise.resolve().then(async () => {
        const userData = userDataStore();
        let userInfo = userData.userInfo || {};
        /** 获取用户信息 */
        let userInfo_ = await userApi
            .getUserInfo()
            .then((res) => {
                return res.data || {};
            })
            .catch(() => {
                return {};
            });
        console.log('获取用户信息成功', userInfo_);
        /** 写入基本信息  */
        userData.setUserInfo(Object.assign({}, userInfo, userInfo_));
        /**
         * 获取用户目录列表
         * name表示对应的系统目录，有name才有此系统目录的权限
         * 有path的可直接跳转
         * 没path的，根据name获取映射的系统菜单属性进行跳转
         *  */
        let menuList = await userApi
            .getMenuList()
            .then((res) => {
                return res.data || {};
            })
            .catch(() => {
                return [];
            });
        console.log('获取用户目录成功', deepCopyObj(menuList));
        let transData = transUserMenu(menuList);
        /** 写入展示菜单数据 */
        userData.setUserMenuList(transData.userMenuList);
        /** 写入权限菜单数据 */
        userData.setUserMenuConfigNameMap(transData.userMenuConfigNameMap);
        userData.setUserMenuConfigPathMap(transData.userMenuConfigPathMap);
        userData.setUserMenuSignMap(transData.userMenuSignMap);
        console.log('格式化用户目录成功', transData.userMenuList);
        if (Object.keys(userData.tagsMap).length > 0) {
            formatTagsByUserMenuConfig();
            console.log('格式化标签成功', userData.tagsMap);
        }
    });
}
/** 用户退出登录 */
export function logout() {
    const userData = userDataStore();
    userData.setUserInfo({});
    userData.setUserMenuList([]);
}
