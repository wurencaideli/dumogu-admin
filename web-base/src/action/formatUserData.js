/**
 * 格式化用户的一些数据
 * 在这里可以接口请求用户的一些数据
 */
import { userDataStore } from '@/store/user';
import { sysMeluNameMap, sysMeluPathMap } from '@/router/common';
import { toTree, unfoldTreeList } from '@/common/treeTools';
import { getNanoid } from '@/common/guid';
import userApi from '@/http/user';

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
    let userMenuConfigMap = {};
    let userMenuList = [];
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
    menuList.forEach((item) => {
        /**
         * 根据目录配置找到对应的系统menu
         * 添加权限，添加已有的权限列表
         * 因为path属于name的子集，所以name,path都应该有自己的配置
         * 赋予正确的名称，并添加以path为优先，name次之的权限
         *  */
        let path = item.path;
        let name = item.name;
        if (!!path && !name) {
            /**
             * 有路由地址，但没菜单名称
             *  */
            path = urlToPath(path);
            let sysMenu = sysMeluPathMap[path] || {};
            item.name = sysMenu.name;
            userMenuConfigMap[path] = item;
        }
        if (!path && !!name) {
            /** 没路由地址，但有菜单名称 */
            let sysMenu = sysMeluNameMap[name] || {};
            item.path = sysMenu.path;
            userMenuConfigMap[name] = item;
        }
        if (!!path && !!name) {
            /**
             * 有路由地址，有菜单名称
             * 以路由为准
             *  */
            path = urlToPath(path);
            userMenuConfigMap[path] = item;
        }
        /** 有唯一标识的也添加，方便查找，可以替换一些信息 */
        if (!!item.sign) {
            userMenuConfigMap[item.sign] = {
                ...item,
            };
        }
    });
    userMenuList = menuList.filter((item) => !item.hidden);
    userMenuList = toTree(
        userMenuList.map((item) => {
            delete item.childs;
            return item;
        }),
        {
            pKey: 'parentSign',
            key: 'sign',
            childsKey: 'childs',
            isNew: true,
        },
    );
    return {
        userMenuList,
        userMenuConfigMap,
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
        /** 写入基本信息  */
        userData.setUserInfo({
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
         * iconName 菜单icon图标
         * fixed 标签是否固定
         *  */
        let menuList = await userApi
            .getMenuList()
            .then((res) => {
                return res.data || {};
            })
            .catch(() => {
                return [];
            });
        let transData = transUserMenu(menuList);
        /** 写入展示菜单数据 */
        userData.setUserMenuList(transData.userMenuList);
        /** 写入权限菜单数据 */
        userData.setUserMenuConfigMap(transData.userMenuConfigMap);
    });
}
