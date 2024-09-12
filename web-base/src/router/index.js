/**
 * 路由列表部分
 * 所有路由必须先手动写好，然后由后端菜单接口来进行匹配并且指定是否显示
 */
import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router';
import dumoguConfig from '@/dumogu.config.js';
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

export const constantRoutes = [
    /** 登录注册相关页面 */
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
    },
    /** 定义首页重定向地址 */
    {
        path: '',
        redirect: '/main/index',
    },
    /** 其他业务相关页面 */
    {
        path: '/main',
        component: () => import('@/layout/main/index.vue'),
        children: [
            /**
             * 重定向页面
             * 用来刷新标签页
             *  */
            {
                path: 'redirect/:path(.*)',
                name: 'main-redirect',
                component: () => import('@/views/system/redirect/index.vue'),
                meta: {
                    layoutName: 'main',
                    isMenu: true,
                    redirectName: 'main-redirect', // 重新向的目标
                },
            },
            {
                path: '401',
                name: 'main-401',
                component: () => import('@/views/system/error/401.vue'),
                meta: {
                    layoutName: 'main',
                    isMenu: true,
                    redirectName: 'main-redirect', // 重新向的目标
                },
            },
            {
                path: '404',
                name: 'main-404',
                component: () => import('@/views/system/error/404.vue'),
                meta: {
                    layoutName: 'main',
                    isMenu: true,
                    redirectName: 'main-redirect', // 重定向的目标
                },
            },
            {
                path: 'new-tag-page/:sign',
                component: () => import('@/views/system/newTagPage/index.vue'),
                name: 'new-tag-page',
                meta: {
                    layoutName: 'main',
                    isMenu: true,
                    redirectName: 'main-redirect', // 重定向的目标
                    title: '新标签', // 新标签
                },
            },
            {
                path: 'iframe/:sign(.*)',
                component: () => import('@/views/system/iframe/index.vue'),
                name: 'iframe',
                meta: {
                    layoutName: 'main',
                    isMenu: true,
                    redirectName: 'main-redirect', // 重定向的目标
                },
            },
            /** 一些页面例子 */
            {
                path: 'index',
                component: () => import('@/views/system/main/index.vue'),
                name: 'main-index',
                meta: {
                    layoutName: 'main',
                    isMenu: true,
                    redirectName: 'main-redirect', // 重定向的目标
                },
            },
            {
                path: 'icon-list',
                component: () => import('@/views/system/iconList/index.vue'),
                name: 'icon-list',
                meta: {
                    layoutName: 'main',
                    isMenu: true,
                    redirectName: 'main-redirect', // 重定向的目标
                },
            },
        ],
    },
    /** 404页面 */
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/system/error/404.vue'),
    },
    /** 401页面 */
    {
        path: '/401',
        component: () => import('@/views/system/error/401.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(dumoguConfig.routeBasePath),
    routes: constantRoutes,
});
/** 此处只添加路由进度条动画 */
router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
});
router.afterEach(() => {
    NProgress.done();
    /** 清除loading标记 */
    let loadingEl = document.querySelector('#html-loading-el');
    if (loadingEl) {
        loadingEl.remove();
    }
});

export default router;
