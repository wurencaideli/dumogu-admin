/** 
 * 权限验证相关函数
 *  */
import {userData} from "@/store/user";

/** 
 * 按钮权限过滤
 * 判断本次登录用户是否有该权限
 *  */
function hasPermi(permi){
    let userDataStore = userData();
    let userInfo = userDataStore.userInfo || {};
    // 如果没有登录凭证的话表示都无权限
    if(!userInfo.token) return false;
    return true;
}