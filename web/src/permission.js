/** 
 * 路由权限配置
 * 只做路由跳转时的权限验证
 */
import router from '@/router/index';
import {userData as userDataStore} from "@/store/User";
import {getUserData} from "@/action/FormatUserData";
import {
    sysMeluNameMap,
} from "@/router/Common";

/** 
 * 免登录
 * 权限白名单
 * 包含路径，和目录名
 *  */
const whiteList = [
    '/login', '/auth-redirect', '/bind', '/register','/404','/401',
    'main-redirect',
];
/** 
 * 登录后的白名单
 * 登录之后可以任意访问的白名单
 */
const whiteList_1 = [
    'navigate',
];

router.beforeEach(async (to, from, next) => {
    const userData = userDataStore();
    let toPath = to.path;
    let toFullPath = to.fullPath;
    let toName = to.name;
    /** 如果是白名单中的路由直接放行 */
    if(whiteList.includes(toPath) || whiteList.includes(toName)){
        next();
        return;
    }
    /** 
     * 没登录的跳转到登录页面
     */
    let token = userData.userInfo.token;
    if(!token){
        next(`/login?from=${encodeURIComponent(to.fullPath)}`); // 否则跳转到登录页
        return;
    }
    /** 如果没有菜单则先获取用户数据 */
    if(userData.showMenuList.length == 0){
        await getUserData().catch(()=>{});
    }
    /** 
     * 如果是白名单中的路由直接放行
     * 登录后的白名单
     *  */
    if(whiteList_1.includes(toPath) || whiteList_1.includes(toName)){
        next();
        return;
    }
    /** 
     * 判断用户是否有该目录权限
     * 必须是系统目录的才判断有无权限
     * 如果有权限的才放行
     * 没权限的跳转到401页面
     *  */
    let hasSysMenuConfigObj = userData.hasSysMenuConfigObj;
    if(
        !!sysMeluNameMap[toName] && 
        (
            !hasSysMenuConfigObj[toName] && !hasSysMenuConfigObj[toPath]
        )
    ){
        next(`/401?fullPath=${toFullPath}`); // 没权限的跳转到401
        return;
    }
    next();
});