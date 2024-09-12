/**
 * 路由权限配置
 * 只做路由跳转时的权限验证
 */
import router from '@/router/index';
import { userDataStore } from '@/store/user';
import { getUserData } from '@/action/formatUserData';
import { sysMeluNameMap, sysMeluPathMap, sysMeluList } from '@/router/common';
import { deepCopyObj } from '@/common/otherTools';

/**
 * 免登录
 * 权限白名单
 * 包含路径，和目录名
 *  */
const whiteList = ['/login', '/register', '/404', '/401'];
/**
 * 登录后的白名单
 * 登录之后可以任意访问的白名单
 */
const whiteList_1 = [
    'navigate',
    'main-index',
    'new-tag-page',
    'icon-list',
    'main-redirect',
    'main-401',
    'main-404',
];

router.beforeEach(async (to, from, next) => {
    const userData = userDataStore();
    let toPath = to.path;
    let toName = to.name;
    let toFullPath = to.fullPath;
    /** 如果是白名单中的路由直接放行 */
    if (whiteList.includes(toPath) || whiteList.includes(toName)) {
        next();
        return;
    }
    /**
     * 没登录的跳转到登录页面
     */
    let token = userData.userInfo.token;
    if (!token) {
        next(`/login?from=${encodeURIComponent(toFullPath)}`);
        return;
    }
    /** 如果没有菜单则先获取用户数据 */
    if (userData.userMenuList.length == 0) {
        await getUserData().catch(() => {});
    }
    /**
     * 如果是白名单中的路由直接放行
     * 登录后的白名单
     *  */
    if (whiteList_1.includes(toPath) || whiteList_1.includes(toName)) {
        next();
        return;
    }
    /**
     * 系统中没定义该目录则转到 404 页面
     */
    if (!!sysMeluNameMap[toName] && !!sysMeluPathMap[toPath]) {
        next('/404');
        return;
    }
    /**
     * 判断用户是否有该目录权限
     * 没权限的跳转到401页面
     *  */
    let userMenuConfigMap = userData.userMenuConfigMap;
    if (!userMenuConfigMap[toName] && !userMenuConfigMap[toPath]) {
        next(`/401?fullPath=${toFullPath}`); // 没权限的跳转到401
        return;
    }
    next();
});

router.afterEach((to) => {
    addTag(to); // 添加页面标签
});

/** 根据系统目录获取用户的目录配置 */
function getUserMenu(route) {
    const userData = userDataStore();
    /** 优先使用当前的path判断获取映射 */
    let target = userData.userMenuConfigMap[route.path] || userData.userMenuConfigMap[route.name];
    return target;
}

/**
 * 根据当前路由情况 添加标签
 * 必须是系统目录才添加标签
 */
let sortNumber = 0;
function addTag(route) {
    if (!route.meta || !route.meta.isMenu) return; //必须是系统目录才能添加目录标签
    /** 必须是系统目录中的，不然不允许添加标签，因为只有属于目录才会有标签 */
    if (!sysMeluList.find((item) => item.name == route.name)) return;
    let userData = userDataStore();
    let tagList = deepCopyObj(userData.tagList);
    /** 获取该路由对应的用户配置 */
    const userMenuConfig = getUserMenu(route) || {};
    /** 如果没有该路由配置表示不允许添加标签页 */
    sortNumber++;
    /**
     * 创建一个新标签，配置其属性
     * 其中sign是唯一标识，很重要，必填
     * name 必填
     * */
    let newTag = Object.assign({}, { ...route.meta }, userMenuConfig, {
        path: route.path,
        fullPath: route.fullPath,
        sortNumber: sortNumber, // 显示的顺序号
    });
    /**
     * 不重复添加
     * 相同path的判断为重复
     *  */
    let target = tagList.find((item) => item.path == route.path);
    if (!target) {
        // 添加进入标签列表，添加到当前标签的右边
        let index = tagList.findIndex((item) => {
            return item.path == route.path;
        });
        if (index != -1) {
            tagList.splice(index + 1, 0, newTag);
        } else {
            tagList.push(newTag);
        }
    } else {
        target.sortNumber = sortNumber; // 更新显示顺序
        /** 防止没有刷新地址 */
        target.redirectName = target.redirectName || newTag.redirectName;
    }
    userData.setTagList(tagList);
}
