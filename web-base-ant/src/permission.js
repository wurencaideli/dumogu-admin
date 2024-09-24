/**
 * 路由权限配置
 * 只做路由跳转时的权限验证
 */
import router from '@/router/index';
import { userDataStore } from '@/store/user';
import { getUserData } from '@/action/formatUserData';
import { sysMeluConfigNameMap, sysMeluConfigPathMap, sysMeluConfigList } from '@/router/common';
import { deepCopyObj } from '@/common/otherTools';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
//全局进度条的配置
NProgress.configure({
    easing: 'ease', // 动画方式
    speed: 300, // 递增进度条的速度
    showSpinner: false, // 进度环显示隐藏
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3, // 更改启动时使用的最小百分比
    parent: 'body', //指定进度条的父容器
});

/**
 * 免登录
 * 权限白名单
 * 包含路径，和目录名
 *  */
const whiteList = ['/login', '/register', '/404', '/401'];
/**
 * 登录后的白名单
 * 登录之后可以任意访问的白名单
 * 包含路径，和目录名
 */
const whiteList_1 = [
    'main-index',
    'new-tag-page',
    'icon-list',
    'main-redirect',
    'main-401',
    'main-404',
    'main-mine-info',
    'main-mine-info-update',
    'main-mine-info-password',
];

router.beforeEach(async (to, from, next) => {
    NProgress.start();
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
     * 系统中没定义该目录的配置则转到 404 页面
     */
    if (!sysMeluConfigNameMap[toName] && !sysMeluConfigPathMap[toPath]) {
        next(`/404?fullPath=${toFullPath}`);
        return;
    }
    /**
     * 判断用户是否有该目录配置（判断是否有该目录权限）
     * 没权限的跳转到401页面
     *  */
    let userMenuConfigNameMap = userData.userMenuConfigNameMap;
    let userMenuConfigPathMap = userData.userMenuConfigPathMap;
    if (!userMenuConfigNameMap[toName] && !userMenuConfigPathMap[toPath]) {
        next(`/401?fullPath=${toFullPath}`); // 没权限的跳转到401
        return;
    }
    next();
});

router.afterEach((to) => {
    NProgress.done();
    /** 清除loading标记 */
    let loadingEl = document.querySelector('#html-loading-el');
    if (loadingEl) {
        loadingEl.remove();
    }
    /** 添加页面标签，根据目录配置添加 */
    addTag(to);
});

/**
 * 根据当前路由情况 添加标签
 * 必须是系统目录才添加标签
 */
let sortNumber = 0; // 用作标识添加顺序，回退标签时需要
function addTag(route) {
    let userData = userDataStore();
    let toPath = route.path;
    let toName = route.name;
    let toFullPath = route.fullPath;
    /** 获取该路由对应的系统配置 */
    let sysMenuConfig = sysMeluConfigPathMap[toPath] || sysMeluConfigNameMap[toName];
    if (!sysMenuConfig) return;
    /** 获取该路由对应的用户配置 */
    const userMenuConfig =
        userData.userMenuConfigPathMap[toPath] || userData.userMenuConfigNameMap[toName] || {};
    /** 合并该配置（用户配置优先）,并将它用作标签 */
    const menuConfig = Object.assign({}, sysMenuConfig, userMenuConfig, {
        path: toPath,
        fullPath: toFullPath,
    });
    /** 必须配置了可添加为标签才能添加标签 */
    if (!menuConfig.hasTag) return;
    let localTagsMap = deepCopyObj(userData.tagsMap);
    localTagsMap[menuConfig.layoutName || ''] = localTagsMap[menuConfig.layoutName || ''] || [];
    let localTagList = localTagsMap[menuConfig.layoutName || '']; //本地已有的标签列表
    /** 初始化sortNumber，使用本地标签的sortNumber最大值 */
    if (!sortNumber && localTagList.length > 0) {
        localTagList.forEach((item) => {
            if (!item.sortNumber) return;
            let sortNumber_ = Number(item.sortNumber);
            if (sortNumber_ > sortNumber) {
                sortNumber = sortNumber_;
            }
        });
    }
    sortNumber++;
    menuConfig.sortNumber = sortNumber; // 写入添加顺序
    /**
     * 不重复添加
     * 相同path的判断为重复
     *  */
    let target = localTagList.find((item) => item.path == toPath);
    if (!target) {
        // 添加进入标签列表，添加到当前标签的右边
        let sortNumber_ = -1;
        let index = -1;
        localTagList.forEach((item_, index_) => {
            let sortNumber__ = item_.sortNumber || 0;
            if (sortNumber__ > sortNumber_) {
                sortNumber_ = sortNumber__;
                index = index_;
            }
        });
        if (index != -1) {
            localTagList.splice(index + 1, 0, menuConfig);
        } else {
            localTagList.push(menuConfig);
        }
    } else {
        target.sortNumber = sortNumber; // 更新显示顺序
        /** 防止没有刷新地址 */
        target.redirectName = target.redirectName || menuConfig.redirectName;
    }
    userData.setTagsMap(localTagsMap);
}
