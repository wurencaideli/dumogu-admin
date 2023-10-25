/** 
 * 标签数组的操作
 * 包含刷新当前标签页，操作标签数组，添加删除标签数组
 */
import {userData} from "@/store/User";
import router from '@/router';

/** 
 * 删除当前的标签
 * 只负责删除标签
 *  */
export function deleteCurrentTag(){
    let userDataStore = userData();
    let tagList = userDataStore.tagList;
    let activeSign = userDataStore.activeSign;
    let index = tagList.findIndex(item=>{
        return item.sign == activeSign && !item.fixed;
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
        userDataStore.setTagList([...tagList]);
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
 * 获取历史记录里最近的一个标签（不在标签列表中的过滤掉）
 */
export function getLatelyHisTag(){
    let userDataStore = userData();
    let tagList = userDataStore.tagList;
    /** 先处理已经删除了的历史记录 */
    let tagHisList = userDataStore.tagHisList;
    let signMap = tagList.reduce((c,i)=>{
        c[i.sign] = true;
        return c;
    },{});
    tagHisList = tagHisList.filter(item=>{
        return signMap[item.sign];
    });
    userDataStore.setTagHisList(tagHisList);
    tagHisList = userDataStore.tagHisList;
    return tagHisList[tagHisList.length - 1];
}
/** 
 * 格式化标签列表
 * 与目录重新建立关系，相当于更新了一下标签
 *  */
export function formatTagsByMenu(){
    let userDataStore = userData();
    let tagList = userDataStore.tagList;
    let menuList = userDataStore.menuList;
    let pathMap = {};
    let nameMap = {};
    menuList.forEach(item=>{
        pathMap[item.path] = item;
        nameMap[item.name] = item;
    });
    let tagList_ = [];
    tagList.forEach(item=>{
        /** 优先取path */
        let userMenuConfig = pathMap[item.path] || nameMap[item.menuName];
        /** 有目录权限的才更新*/
        if(!userMenuConfig) return;
        item = {
            ...item,
            isCache:userMenuConfig.isCache,  //表示该标签需要缓存
            fixed:userMenuConfig.fixed,  //表示该标签需要固定
            title:userMenuConfig.title,
        };
        tagList_.push(item);
    });
    userDataStore.setTagList(tagList_);
}