/** 
 * 路由权限配置
 * 只做路由跳转时的权限验证
 * 不做什么自动什么什么的，获取数据自己手动去调用，要的就是手动挡的可操作性，出错了也只是调用的问题
 */
import router from './index';
import {userData as userDataStore} from "@/store/user";
import { ElMessage } from 'element-plus';
import {getUserData} from "@/action/FormatUserData";

/** 权限白名单 */
const whiteList = [
    '/login', '/auth-redirect', '/bind', '/register','/404','/401',
];

router.beforeEach(async (to, from, next) => {
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
    let token = userData.userInfo.token;
    if(!token){
        next(`/login?redirect=${to.fullPath}`); // 否则跳转到登录页
        return;
    }
    /** 如果没有菜单则先获取用户数据 */
    if(userData.menuList.length == 0){
        await getUserData().catch(()=>{});
    }
    /** 
     * 判断用户是否有权限
     * 如果有权限的才放行
     * 没权限的跳转到登录页面
     *  */
    let menuList = userData.menuList;
    if(!menuList.find(item=>item.path==toPath)){
        next(`/401`); // 没权限的跳转到401
        return;
    }
    next();
});