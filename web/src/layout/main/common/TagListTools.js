/** 
 * 标签数组的操作
 * 包含刷新当前标签页，操作标签数组，添加删除标签数组
 */
import {userData} from "@/store/User";
import router from '@/router';
import {deepCopyObj} from "@/common/OtherTools";
import tagDataStore from "./TagData";

/** 
 * 获取标签
 * 返回新对象，防止获取了就直接修改
 * * 参数 标签唯一标识
 *  */
export function getTag(sign){
    let tagList = tagDataStore.tagList;
    let target = tagList.find(item=>{
        return item.sign == sign;
    });
    if(!target) return target;
    return deepCopyObj(target);
}
/** 
 * 删除标签，可批量删除
 * 可删除任意标签
 * 参数 标签唯一标识 数组
 */
export function deleteTags(signs){
    if(!signs) return;
    /** 不是数组的转换一下，方便操作 */
    if(!Array.isArray(signs)){
        signs = [signs];
    }
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagList = deepCopyObj(tagDataStore.tagList);
    tagList = tagList.filter(item=>{
        return !signs.includes(item.sign);
    });
    tagDataStore.setTagList(tagList);
}
/** 
 * 刷新指定标签页
 * params 标签唯一标识
 *  */
export function refreshTag(sign){
    let tagList = deepCopyObj(tagDataStore.tagList);
    let target = tagList.find(item=>{
        return item.sign == sign;
    });
    if(!target) return;
    if(!target.redirectPath) {
        /** 没有刷新地址的跳回原地址 */
        router.push(target.fullPath);
        return;
    };
    let isCache = target.isCache;
    /** 取消缓存 */
    target.isCache = false;
    tagDataStore.setTagList(tagList);
    /** 路由解析完后还原该标签的缓存属性 */
    let myAfterEach = router.afterEach(() => {
        if(!target) return;
        target.isCache = isCache;
        target = null;
        tagDataStore.setTagList(deepCopyObj(tagList));
        /** 注销此函数 */
        myAfterEach();
        myAfterEach = null;
    });
    /** 跳转到重定向页面 */
    router.push(target.redirectPath);
}
/** 
 * 刷新所有标签页
 */
export function refreshAllTag(){
    let activeSign = tagDataStore.activeSign;
    let tagList = deepCopyObj(tagDataStore.tagList);
    let tagList_1 = deepCopyObj(tagDataStore.tagList);
    tagList.forEach(item=>{
        item.isCache = false;
    });
    tagDataStore.setTagList(tagList);
    /** 路由解析完后还原标签的缓存属性 */
    let myAfterEach = router.afterEach(() => {
        tagDataStore.setTagList(tagList_1);
        /** 注销此函数 */
        myAfterEach();
        myAfterEach = null;
    });
    /** 跳转到重定向页面 */
    let target = tagList.find(item=>{
        return item.sign == activeSign;
    });
    if(!target) return;
    if(!target.redirectPath) {
        /** 没有刷新地址的跳回原地址 */
        router.push(target.fullPath);
        return;
    };
    router.push(target.redirectPath);
}
/** 
 * 修改标签
 * 参数是一个tag对象数据
 *  */
export function updateTag(tag){
    if(!tag || !tag.sign) return;
    let tagList = deepCopyObj(tagDataStore.tagList);
    let target = tagList.find(item=>{
        return item.sign == tag.sign;
    });
    if(!target) return;
    /** 只修改有的属性 */
    Object.keys(tag).forEach(key=>{
        target[key] = tag[key];
    });
    tagDataStore.setTagList(tagList);
}
/** 
 * 删除当前的标签
 * 只负责删除标签
 *  */
export function deleteCurrentTag(){
    let tagList = tagDataStore.tagList;
    let activeSign = tagDataStore.activeSign;
    let target = tagList.find(item=>{
        return item.sign == activeSign && !item.fixed;
    });
    if(!target) return;
    deleteTags(target.sign);
}
/** 刷新当前标签 */
export function refreshCurrentTag(){
    let activeSign = tagDataStore.activeSign;
    refreshTag(activeSign);
}
/** 
 * 关闭除了当前的所有其他标签
 * 固定的除外
 *  */
export function deleteOtherTags(){
    let tagList = tagDataStore.tagList;
    let activeSign = tagDataStore.activeSign;
    let signs = tagList.filter(item=>{
        return item.sign != activeSign && !item.fixed;
    }).map(item=>item.sign);
    deleteTags(signs);
}
/** 
 * 关闭除了当前的左边的所有其他标签
 * 固定的除外
 *  */
export function deleteLeftTags(){
    let tagList = tagDataStore.tagList;
    let activeSign = tagDataStore.activeSign;
    let index = tagList.findIndex(item=>{
        return item.sign == activeSign;
    });
    let signs = tagList.filter((item,index_)=>{
        return index_ < index && !item.fixed;
    }).map(item=>item.sign);
    deleteTags(signs);
}
/** 
 * 关闭除了当前的左边的所有其他标签
 * 固定的除外
 *  */
export function deleteRightTags(){
    let tagList = tagDataStore.tagList;
    let activeSign = tagDataStore.activeSign;
    let index = tagList.findIndex(item=>{
        return item.sign == activeSign;
    });
    let signs = tagList.filter((item,index_)=>{
        return index_ > index && !item.fixed;
    }).map(item=>item.sign);
    deleteTags(signs);
}
/** 
 * 获取历史记录里最近的一个标签（不在标签列表中的过滤掉）
 */
export function getLatelyHisTag(){
    let tagList = tagDataStore.tagList;
    /** 先处理已经删除了的历史记录 */
    let tagHisList = deepCopyObj(tagDataStore.tagHisList);
    let signMap = tagList.reduce((c,i)=>{
        c[i.sign] = true;
        return c;
    },{});
    tagHisList = tagHisList.filter(item=>{
        return signMap[item.sign];
    });
    tagDataStore.setTagHisList(tagHisList);
    tagHisList = tagDataStore.tagHisList;
    return tagHisList[tagHisList.length - 1];
}
/** 
 * 格式化标签列表
 * 与目录重新建立关系，相当于更新了一下标签
 *  */
export function formatTagsByMenu(){
    let userDataStore = userData();
    let tagList = deepCopyObj(tagDataStore.tagList);
    let hasSysMenuConfigObj = userDataStore.hasSysMenuConfigObj;
    let tagList_ = [];
    tagList.forEach(item=>{
        /** 优先取path */
        let userMenuConfig = hasSysMenuConfigObj[item.path] || hasSysMenuConfigObj[item.menuName];
        /** 有目录权限的才更新*/
        if(!userMenuConfig) return;
        item = {
            ...item,
            isCache:userMenuConfig.isCache,  //表示该标签需要缓存
            fixed:userMenuConfig.fixed,  //表示该标签需要固定
            title:userMenuConfig.title,
            showTagIcon:userMenuConfig.showTagIcon,  //表示该标签是否需要显示icon
            iconName:userMenuConfig.iconName,
        };
        tagList_.push(item);
    });
    tagDataStore.setTagList(tagList_);
}
/** 
 * 获取当前的标签
 * 返回新对象，防止获取了就直接修改
 *  */
export function getCurrentTag(){
    let activeSign = tagDataStore.activeSign;
    return getTag(activeSign);
}
