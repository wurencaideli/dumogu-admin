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
        component:() => import('@/layout/main/index.vue'),
        children: [
            /** 
             * 重定向页面
             * 用来刷新标签页
             *  */
            {
                path: 'redirect/:path(.*)',
                name:'main-redirect',
                component: () => import('@/views/redirect/index.vue'),
                meta: { 
                    /** 该页面属于此操作页面，但是不算菜单，不允许添加到标签页上 */
                    isMenu:false,
                },
            },
            // {
            //     path: '401',
            //     name:'main-401',
            //     component: () => import('@/views/error/401.vue'),
            //     meta: { 
            //         /** 该页面属于此操作页面，但是不算菜单，不允许添加到标签页上 */
            //         isMenu:false,
            //     },
            // },
            {
                path: 'new-tag-page/:sign',
                component: () => import('@/views/system/newTagPage/index.vue'),
                name: 'new-tag-page',
                meta: { 
                    isMenu:true,
                },
            },
            /** 一些页面例子 */
            {
                path: 'index',
                component: () => import('@/views/exampleViews/main/index.vue'),
                name: 'main-index',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'show-list',
                component: () => import('@/views/exampleViews/showList/index.vue'),
                name: 'show-list',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'show-list/add',
                component: () => import('@/views/exampleViews/showList/add.vue'),
                name: 'show-list-add',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'show-list/update/:sign',
                component: () => import('@/views/exampleViews/showList/add.vue'),
                name: 'show-list-update',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'show-list/info/:sign',
                component: () => import('@/views/exampleViews/showList/info.vue'),
                name: 'show-list-info',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'user-list',
                component: () => import('@/views/exampleViews/userList/index.vue'),
                name: 'user-list',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'role-list',
                component: () => import('@/views/exampleViews/roleList/index.vue'),
                name: 'role-list',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'icon-list',
                component: () => import('@/views/exampleViews/iconList/index.vue'),
                name: 'icon-list',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'mine',
                component: () => import('@/views/exampleViews/mine/index.vue'),
                name: 'mine',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'setup-tag',
                component: () => import('@/views/exampleViews/setupTag/index.vue'),
                name: 'setup-tag',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'setup-menu',
                component: () => import('@/views/exampleViews/setupMenu/index.vue'),
                name: 'setup-menu',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'system/menu',
                component: () => import('@/views/system/menu/index.vue'),
                name: 'menu',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'system/bt-permission',
                component: () => import('@/views/system/btPermission/index.vue'),
                name: 'bt-permission',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'iframe/:sign(.*)',
                component: () => import('@/views/system/iframe/index.vue'),
                name: 'iframe',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'other-view',
                component: () => import('@/views/exampleViews/otherView/index.vue'),
                name: 'other-view',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'merge-table',
                component: () => import('@/views/exampleViews/mergeTable/index.vue'),
                name: 'merge-table',
                meta: { 
                    isMenu:true,
                },
            },
        ],
    },
    {
        path: '/big-screen',
        component:() => import('@/layout/bigScreen/index.vue'),
        children: [
            /** 
             * 重定向页面
             * 用来刷新标签页
             *  */
            {
                path: 'redirect/:path(.*)',
                name:'big-screen-redirect',
                component: () => import('@/views/redirect/index.vue'),
                meta: { 
                    /** 该页面属于此操作页面，但是不算菜单，不允许添加到标签页上 */
                    isMenu:false,
                },
            },
            {
                path: 'show_1',
                component: () => import('@/views/bigScreen/show_1/index.vue'),
                name: 'big-screen-show_1',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'show_2',
                component: () => import('@/views/bigScreen/show_2/index.vue'),
                name: 'big-screen-show_2',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'show_3',
                component: () => import('@/views/bigScreen/show_3/index.vue'),
                name: 'big-screen-show_3',
                meta: { 
                    isMenu:true,
                },
            },
            {
                path: 'show_4',
                component: () => import('@/views/bigScreen/show_4/index.vue'),
                name: 'big-screen-show_4',
                meta: { 
                    isMenu:true,
                },
            },
        ],
    },
    /** 404页面 */
    {
        path: "/:pathMatch(.*)*",
        component: () => import('@/views/error/404.vue'),
    },
    /** 401页面 */
    {
        path: '/401',
        component: () => import('@/views/error/401.vue'),
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
    /** 清除loading标记 */
    let loadingEl = document.querySelector('#html-loading-el');
    if(loadingEl){
        loadingEl.remove();
    }
});

export default router;
