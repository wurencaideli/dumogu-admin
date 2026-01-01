/**
 * 路由列表部分
 * 所有路由必须先手动写好，然后由后端菜单接口来进行匹配并且指定是否显示
 */
import { env } from '@/env.js';
import { createWebHistory, createRouter } from 'vue-router';

/** @type {import('vue-router').RouteRecordRaw[]} */
export const constantRoutes = [
    /** 登录注册相关页面 */
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
    },
    /** 404页面 */
    {
        path: '/404',
        component: () => import('@/views/system/error/404.vue'),
        name: '404',
    },
    /** 401页面 */
    {
        path: '/401',
        component: () => import('@/views/system/error/401.vue'),
        name: '401',
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
             */
            {
                path: 'redirect/:path(.*)',
                name: 'main-redirect',
                component: () => import('@/views/system/redirect/index.vue'),
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                },
            },
            {
                path: '401',
                name: 'main-401',
                component: () => import('@/views/system/error/401.vue'),
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                    hasTag: true,
                    title: '401',
                },
            },
            {
                path: '404',
                name: 'main-404',
                component: () => import('@/views/system/error/404.vue'),
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                    hasTag: true,
                    title: '404',
                },
            },
            {
                path: 'new-tag-page/:sign',
                component: () => import('@/views/system/new-tag-page/index.vue'),
                name: 'new-tag-page',
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                    title: '新标签',
                    hasTag: true,
                },
            },
            {
                path: 'iframe/:sign(.*)',
                component: () => import('@/views/system/iframe/index.vue'),
                name: 'iframe',
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                    hasTag: true,
                },
            },
            /** 一些页面例子 */
            {
                path: 'index',
                component: () => import('@/views/system/main/index.vue'),
                name: 'main-index',
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                    hasTag: true,
                },
            },
            {
                path: 'icon-list',
                component: () => import('@/views/system/icon-list/index.vue'),
                name: 'icon-list',
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                    hasTag: true,
                },
            },
            {
                path: 'mine/info',
                component: () => import('@/views/system/mine/index.vue'),
                name: 'main-mine-info',
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                    title: '个人中心',
                    hasTag: true,
                },
            },
            {
                path: 'mine/info-update',
                component: () => import('@/views/system/mine/update.vue'),
                name: 'main-mine-info-update',
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                    title: '修改个人信息',
                    hasTag: true,
                },
            },
            {
                path: 'mine/info-password',
                component: () => import('@/views/system/mine/password.vue'),
                name: 'main-mine-info-password',
                meta: {
                    layoutName: 'main',
                    redirectName: 'main-redirect',
                    title: '修改密码',
                    hasTag: true,
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(env.APP_routeBasePath),
    routes: constantRoutes,
});

export default router;
