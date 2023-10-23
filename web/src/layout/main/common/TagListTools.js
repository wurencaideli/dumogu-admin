/** 
 * 标签数组的操作
 * 包含刷新当前标签页，操作标签数组，添加删除标签数组
 */
import {userData} from "@/store/User";
import router from '@/router';

/** 删除当前的标签 */
export function deleteCurrentTag(){
    let userDataStore = userData();
    let tagList = userDataStore.tagList;
    let activeSign = userDataStore.activeSign;
    let index = tagList.findIndex(item=>{
        return item.sign == activeSign;
    });
    if(index == -1) return;
    tagList.splice(index,1);
    userDataStore.setTagList(tagList);
}
/** 刷新当前标签 */
export function refreshCurrentTag(){
    let userDataStore = userData();
    let tagList = userDataStore.tagList;
    let activeSign = userDataStore.activeSign;
    let target = tagList.find(item=>{
        return item.sign == activeSign;
    });
    if(!target) return;
    let isCache = target.isCache;
    /** 取消缓存 */
    target.isCache = false;
    userDataStore.setTagList([...tagList]);
    /** 路由解析完后还原该标签的缓存属性 */
    router.afterEach(() => {
        if(!target) return;
        target.isCache = isCache;
        target = null;
    });
    /** 跳转到重定向页面 */
    router.push({
        name:'main-redirect',
        params:{
            path:target.fullPath,
        },
    });
}
/** 
 * 关闭除了当前的所有其他标签
 * 固定的除外
 *  */
export function deleteOtherTags(){
    let userDataStore = userData();
    let tagList = userDataStore.tagList;
    let activeSign = userDataStore.activeSign;
    let tagList_ = tagList.filter(item=>{
        return item.sign == activeSign || !!item.fixed;
    });
    userDataStore.setTagList(tagList_);
}
/** 
 * 关闭除了当前的左边的所有其他标签
 * 固定的除外
 *  */
export function deleteLeftTags(){
    let userDataStore = userData();
    let tagList = userDataStore.tagList;
    let activeSign = userDataStore.activeSign;
    let index = tagList.findIndex(item=>{
        return item.sign == activeSign;
    });
    let tagList_ = tagList.filter((item,index_)=>{
        return index_ >= index || !!item.fixed;
    });
    userDataStore.setTagList(tagList_);
}
/** 
 * 关闭除了当前的左边的所有其他标签
 * 固定的除外
 *  */
export function deleteRightTags(){
    let userDataStore = userData();
    let tagList = userDataStore.tagList;
    let activeSign = userDataStore.activeSign;
    let index = tagList.findIndex(item=>{
        return item.sign == activeSign;
    });
    let tagList_ = tagList.filter((item,index_)=>{
        return index_ <= index || !!item.fixed;
    });
    userDataStore.setTagList(tagList_);
}
/** 
 * 跳转到其他最近的页面
 * 根据一个参照标签进行跳转
 *  */
export function toReferPath(referTagIndex){
    let userDataStore = userData();
    referTagIndex = referTagIndex || 0;
    let tagList = userDataStore.tagList;
    let tag = tagList[referTagIndex] || tagList[referTagIndex - 1] || tagList[referTagIndex + 1];
    if(tag){
        router.push(tag.fullPath);
    }
}