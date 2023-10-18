/** 
 * 路由权限配置
 */
import router from './index';
import {userData as userDataStore} from "@/store/user";
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';

/** 权限白名单 */
const whiteList = ['/login', '/auth-redirect', '/bind', '/register','/404','/401'];

router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
    return;
    const userData = userDataStore();
    let toPath = to.path;
    /** 如果是白名单中的路由直接放行 */
    if(whiteList.includes(toPath)){
        next();
        return;
    }
    /** 
     * 没登录的跳转到登录页面
     */
    let token = userData.token;
    if(!token){
        next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
        return;
    }
    /** 
     * 判断用户是否有权限
     * 如果有权限的才放行
     * 没权限的跳转到登录页面
     *  */
    let menuList = userData.menuList;
    if(!menuList.includes(toPath)){
        next(`/401`); // 没权限的跳转到401
        return;
    }
    next();
});

router.afterEach(() => {
    NProgress.done();
});
