/**
 * 标签数组的操作
 * 包含刷新当前标签页，操作标签数组，添加删除标签数组
 */
import { userDataStore } from '@/store/user';
import router from '@/router';
import { deepCopyObj } from '@/common/otherTools';
import { sysMeluConfigNameMap, sysMeluConfigPathMap } from '@/router/common';

/** 从所有标签中找到相应的tag */
export function findTag(path) {
    let userData = userDataStore();
    let tagsMap = userData.tagsMap;
    let target;
    Object.values(tagsMap).find((item) => {
        if (!item || item.length == 0) return false;
        target = item.find((item_) => {
            return item_.path == path;
        });
        return !!target;
    });
    return target;
}
/**
 * 获取标签
 */
export function getTag({ path, layoutName } = {}) {
    let userData = userDataStore();
    let tagsMap = userData.tagsMap;
    let tagList = tagsMap[layoutName || ''] || [];
    let target = tagList.find((item) => {
        return item.path == path;
    });
    return target;
}
/**
 * 删除标签，可批量删除
 * 参数 标签唯一标识 数组
 */
export function deleteTags({ paths, layoutName } = {}) {
    let userData = userDataStore();
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagsMap = deepCopyObj(userData.tagsMap);
    let tagList = tagsMap[layoutName || ''] || [];
    if (!paths) return;
    /** 不是数组的转换一下，方便操作 */
    if (!Array.isArray(paths)) {
        paths = [paths];
    }
    tagList = tagList.filter((item) => {
        return !paths.includes(item.path);
    });
    tagsMap[layoutName || ''] = tagList;
    userData.setTagsMap(tagsMap);
}
/**
 * 修改标签
 * 参数是一个tag对象数据
 *  */
export function updateTag({ tag, layoutName } = {}) {
    let userData = userDataStore();
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagsMap = deepCopyObj(userData.tagsMap);
    let tagList = tagsMap[layoutName || ''] || [];
    if (!tag || !tag.path) return;
    let target = tagList.find((item) => {
        return item.path == tag.path;
    });
    if (!target) return;
    /** 只修改有的属性 */
    Object.keys(tag).forEach((key) => {
        target[key] = tag[key];
    });
    userData.setTagsMap(tagsMap);
}
/**
 * 格式化标签列表
 * 与目录重新建立关系，相当于更新了一下标签
 *  */
export function formatTagsByUserMenuConfig() {
    let userData = userDataStore();
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagsMap = deepCopyObj(userData.tagsMap);
    let pathMap = {};
    Object.keys(tagsMap).forEach((key) => {
        let tagList = tagsMap[key] || [];
        const tagList_ = [];
        tagList.forEach((item) => {
            let toPath = item.path;
            let toName = item.name;
            let toFullPath = item.fullPath;
            if (pathMap[toPath]) return;
            /** 获取该路由对应的系统配置 */
            let sysMenuConfig = sysMeluConfigPathMap[toPath] || sysMeluConfigNameMap[toName];
            if (!sysMenuConfig) return;
            /** 获取该路由对应的用户配置 */
            const userMenuConfig =
                userData.userMenuConfigPathMap[toPath] || userData.userMenuConfigNameMap[toName];
            if (!userMenuConfig) return;
            /** 合并该配置（用户配置优先）,并将它用作标签 */
            const menuConfig = Object.assign(item, sysMenuConfig, userMenuConfig, {
                path: toPath,
                fullPath: toFullPath,
            });
            tagList_.push(menuConfig);
            pathMap[toPath] = true;
        });
        tagsMap[key] = tagList_;
    });
    userData.setTagsMap(tagsMap);
}
/**
 * 刷新指定标签页
 * path 标签唯一标识
 * refreshAll 是否刷新全部标签
 *  */
export function refreshTag({ path, refreshAll = false, layoutName }) {
    let userData = userDataStore();
    let tagsMap = deepCopyObj(userData.tagsMap);
    let tagList = tagsMap[layoutName || ''] || [];
    let tagList_1 = deepCopyObj(tagList);
    tagList_1.forEach((item) => {
        item.isCache = false;
    });
    let target = tagList.find((item) => {
        return item.path == path;
    });
    if (!target) return;
    if (!target.redirectName) {
        /** 没有刷新地址的跳回原地址 */
        router.push(target.fullPath);
        return;
    }
    let isCache = target.isCache;
    /** 取消缓存 */
    if (refreshAll) {
        tagsMap[layoutName || ''] = tagList_1;
        userData.setTagsMap(tagsMap);
    } else {
        target.isCache = false;
        tagsMap[layoutName || ''] = tagList;
        userData.setTagsMap(tagsMap);
    }
    /** 路由解析完后还原该标签的缓存属性 */
    let myAfterEach = router.afterEach(() => {
        if (!target) return;
        target.isCache = isCache;
        target = null;
        tagsMap[layoutName || ''] = tagList;
        userData.setTagsMap(deepCopyObj(tagsMap));
        /** 注销此函数 */
        myAfterEach();
        myAfterEach = null;
    });
    /** 跳转到重定向页面 */
    router.push({
        name: target.redirectName,
        params: {
            path: target.fullPath,
        },
    });
}
/**
 * 关闭除了当前的所有其他标签
 * 固定的除外
 *  */
export function deleteOtherTags({ path, layoutName, excludePaths = [] }) {
    let userData = userDataStore();
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagsMap = userData.tagsMap;
    let tagList = tagsMap[layoutName || ''] || [];
    let paths = tagList
        .filter((item) => {
            if (excludePaths.includes(item.path)) return false; // 排除path
            return item.path != path && !item.fixed;
        })
        .map((item) => item.path);
    deleteTags({ paths, layoutName });
}
/**
 * 关闭除了当前的左边的所有其他标签
 * 固定的除外
 *  */
export function deleteLeftTags({ path, layoutName, excludePaths = [] }) {
    let userData = userDataStore();
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagsMap = userData.tagsMap;
    let tagList = tagsMap[layoutName || ''] || [];
    let index = tagList.findIndex((item) => {
        return item.path == path;
    });
    let paths = tagList
        .filter((item, index_) => {
            if (excludePaths.includes(item.path)) return false; // 排除path
            return index_ < index && !item.fixed;
        })
        .map((item) => item.path);
    deleteTags({ paths, layoutName });
}
/**
 * 关闭除了当前的左边的所有其他标签
 * 固定的除外
 *  */
export function deleteRightTags({ path, layoutName, excludePaths = [] }) {
    let userData = userDataStore();
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagsMap = userData.tagsMap;
    let tagList = tagsMap[layoutName || ''] || [];
    let index = tagList.findIndex((item) => {
        return item.path == path;
    });
    let paths = tagList
        .filter((item, index_) => {
            if (excludePaths.includes(item.path)) return false; // 排除path
            return index_ > index && !item.fixed;
        })
        .map((item) => item.path);
    deleteTags({ paths, layoutName });
}
/**
 * 获取历史记录里最近的一个标签（不在标签列表中的过滤掉）
 */
export function getLatelyHisTag({ layoutName }) {
    let userData = userDataStore();
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagsMap = userData.tagsMap;
    let tagList = tagsMap[layoutName || ''] || [];
    let sortNumber = -1;
    let target;
    tagList.forEach((item) => {
        let sortNumber_ = item.sortNumber || 0;
        if (sortNumber_ > sortNumber) {
            sortNumber = sortNumber_;
            target = item;
        }
    });
    return target;
}
/** 获取右边的一个实例 */
export function getRight({ path, layoutName }) {
    let userData = userDataStore();
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagsMap = userData.tagsMap;
    let tagList = tagsMap[layoutName || ''] || [];
    let index = tagList.findIndex((item) => {
        return item.path == path;
    });
    if (index == -1) return;
    let target = tagList[index + 1];
    return target;
}
export function getLeft({ path, layoutName }) {
    let userData = userDataStore();
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagsMap = userData.tagsMap;
    let tagList = tagsMap[layoutName || ''] || [];
    let index = tagList.findIndex((item) => {
        return item.path == path;
    });
    if (index == -1) return;
    let target = tagList[index - 1];
    return target;
}
