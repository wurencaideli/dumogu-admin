/**
 * 路由列表部分
 * 所有路由必须先手动写好，然后由后端菜单接口来进行匹配并且指定是否显示
 */
import {createWebHistory,createRouter,createWebHashHistory} from 'vue-router';
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
    /** 重定向路由 */
    {
        path: '/redirect',
        component:() => import('@/layout/main/index.vue'),
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue')
            }
        ],
    },
    /** 登录注册相关页面 */
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import('@/views/login/register.vue'),
        hidden: true
    },
    /** 定义首页重定向地址 */
    {
        path: '',
        redirect: '/main/index',
    },
    /** 其他业务相关页面 */
    {
        path: '/main',
        component:() => import('@/layout/main/index.vue'),
        children: [
            {
                path: 'index',
                component: () => import('@/views/main/index.vue'),
                name: 'main-index',
                meta: { 
                    title: '首页',
                    isMenu:true,
                },
            },
            {
                path: 'show-list',
                component: () => import('@/views/exampleViews/showList/index.vue'),
                name: 'show-list',
                meta: { 
                    title: '例子页面',
                    isMenu:true,
                },
            },
            {
                path: 'show-list/info/:sign',
                component: () => import('@/views/exampleViews/showList/info.vue'),
                name: 'show-list-info',
                meta: { 
                    title: '例子页面详情',
                    isMenu:true,
                },
            },
        ],
    },
    /** 404页面 */
    {
        path: "/:pathMatch(.*)*",
        component: () => import('@/views/error/404.vue'),
        hidden: true,
    },
    /** 401页面 */
    {
        path: '/401',
        component: () => import('@/views/error/401.vue'),
        hidden: true
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
});
/** 此处只添加路由进度条动画 */
router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
});
router.afterEach(() => {
    NProgress.done();
});

export default router;
