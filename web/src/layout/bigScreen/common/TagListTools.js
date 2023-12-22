/** 
 * 标签数组的操作
 * 包含刷新当前标签页，操作标签数组，添加删除标签数组
 */
import tagDataStore from "./TagData";
import router from '@/router';
import {deepCopyObj} from "@/common/OtherTools";

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
/** 刷新当前标签 */
export function refreshCurrentTag(){
    let activeSign = tagDataStore.activeSign;
    refreshTag(activeSign);
}
/** 
 * 获取当前的标签
 * 返回新对象，防止获取了就直接修改
 *  */
export function getCurrentTag(){
    let activeSign = tagDataStore.activeSign;
    return getTag(activeSign);
}
