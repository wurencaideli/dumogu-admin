/**
 * 权限验证相关函数
 *  */
import { userDataStore } from '@/store/user';

/**
 * 按钮权限过滤
 * 判断本次登录用户是否有该权限
 * permi:String
 *  */
export function hasPermi(permi) {
    let userData = userDataStore();
    let userInfo = userData.userInfo || {};
    let permissionList = userData.permissionList || [];
    // 如果没有登录凭证的话表示都无权限
    if (!userInfo.token) return false;
    // return permissionList.includes(permi);
    return true;
}
