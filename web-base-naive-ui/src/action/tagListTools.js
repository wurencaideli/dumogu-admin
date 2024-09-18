/**
 * 标签数组的操作
 * 包含刷新当前标签页，操作标签数组，添加删除标签数组
 */
import { userDataStore } from '@/store/user';
import router from '@/router';
import { deepCopyObj } from '@/common/otherTools';
import { sysMeluConfigNameMap, sysMeluConfigPathMap, sysMeluConfigList } from '@/router/common';

/**
 * 获取标签
 */
function getTag(path) {
    let userData = userDataStore();
    let tagList = userData.tagList;
    let target = tagList.find((item) => {
        return item.path == path;
    });
    return target;
}
/**
 * 删除标签，可批量删除
 * 可删除任意标签
 * 参数 标签唯一标识 数组
 */
function deleteTags(paths) {
    let userData = userDataStore();
    if (!paths) return;
    /** 不是数组的转换一下，方便操作 */
    if (!Array.isArray(paths)) {
        paths = [paths];
    }
    /** 深度克隆一份，表示不利用自身的属性监听，干干净净 */
    let tagList = deepCopyObj(userData.tagList);
    tagList = tagList.filter((item) => {
        return !paths.includes(item.path);
    });
    userData.setTagList(tagList);
}
/**
 * 修改标签
 * 参数是一个tag对象数据
 *  */
function updateTag(tag) {
    let userData = userDataStore();
    if (!tag || !tag.path) return;
    let tagList = deepCopyObj(userData.tagList);
    let target = tagList.find((item) => {
        return item.path == tag.path;
    });
    if (!target) return;
    /** 只修改有的属性 */
    Object.keys(tag).forEach((key) => {
        target[key] = tag[key];
    });
    userData.setTagList(tagList);
}
/**
 * 格式化标签列表
 * 与目录重新建立关系，相当于更新了一下标签
 *  */
function formatTagsByUserMenuConfig() {
    let userData = userDataStore();
    let tagList = deepCopyObj(userData.tagList);
    let tagList_ = [];
    let pathMap = {};
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
    userData.setTagList(tagList_);
}
/**
 * 刷新指定标签页
 * path 标签唯一标识
 * refreshAll 是否刷新全部标签
 *  */
function refreshTag(path, refreshAll = false, layoutName) {
    let userData = userDataStore();
    let tagList = deepCopyObj(userData.tagList);
    let tagList_1 = deepCopyObj(userData.tagList);
    tagList_1.forEach((item) => {
        if (item.layoutName != layoutName) return; // 只是刷新layoutName相同的
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
        userData.setTagList(tagList_1);
    } else {
        target.isCache = false;
        userData.setTagList(tagList);
    }
    /** 路由解析完后还原该标签的缓存属性 */
    let myAfterEach = router.afterEach(() => {
        if (!target) return;
        target.isCache = isCache;
        target = null;
        userData.setTagList(deepCopyObj(tagList));
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
function deleteOtherTags(path, layoutName) {
    let userData = userDataStore();
    let tagList = userData.tagList;
    let paths = tagList
        .filter((item) => {
            if (item.layoutName != layoutName) return false;
            return item.path != path && !item.fixed;
        })
        .map((item) => item.path);
    deleteTags(paths);
}
/**
 * 关闭除了当前的左边的所有其他标签
 * 固定的除外
 *  */
function deleteLeftTags(path, layoutName) {
    let userData = userDataStore();
    let tagList = userData.tagList;
    let index = tagList.findIndex((item) => {
        return item.path == path;
    });
    let paths = tagList
        .filter((item, index_) => {
            if (item.layoutName != layoutName) return false;
            return index_ < index && !item.fixed;
        })
        .map((item) => item.path);
    deleteTags(paths);
}
/**
 * 关闭除了当前的左边的所有其他标签
 * 固定的除外
 *  */
function deleteRightTags(path, layoutName) {
    let userData = userDataStore();
    let tagList = userData.tagList;
    let index = tagList.findIndex((item) => {
        return item.path == path;
    });
    let paths = tagList
        .filter((item, index_) => {
            if (item.layoutName != layoutName) return false;
            return index_ > index && !item.fixed;
        })
        .map((item) => item.path);
    deleteTags(paths);
}
/**
 * 获取历史记录里最近的一个标签（不在标签列表中的过滤掉）
 */
function getLatelyHisTag(layoutName) {
    let userData = userDataStore();
    let tagList = userData.tagList;
    let sortNumber = -1;
    let target;
    tagList.forEach((item) => {
        if (item.layoutName != layoutName) return;
        let sortNumber_ = item.sortNumber || 0;
        if (sortNumber_ > sortNumber) {
            sortNumber = sortNumber_;
            target = item;
        }
    });
    return target;
}
/** 获取右边的一个实例 */
function getRight(path, layoutName) {
    let userData = userDataStore();
    let tagList = deepCopyObj(userData.tagList);
    let index = tagList.findIndex((item) => {
        if (item.layoutName != layoutName) return false;
        return item.path == path;
    });
    if (index == -1) return;
    let target = tagList[index + 1];
    return target;
}
function getLeft(path, layoutName) {
    let userData = userDataStore();
    let tagList = deepCopyObj(userData.tagList);
    let index = tagList.findIndex((item) => {
        if (item.layoutName != layoutName) return false;
        return item.path == path;
    });
    if (index == -1) return;
    let target = tagList[index - 1];
    return target;
}

/** 生成一个操作tag标签的方法集合，传入layoutName_来操作分组的标签 */
export default function generateTagListTools(layoutName_) {
    let layoutName = layoutName_ || '';
    /**
     * 刷新指定标签页
     * path 标签唯一标识
     * refreshAll 是否刷新全部标签
     *  */
    function refreshTag_(path, refreshAll = false) {
        refreshTag(path, refreshAll, layoutName);
    }
    /**
     * 关闭除了当前的所有其他标签
     * 固定的除外
     *  */
    function deleteOtherTags_(path) {
        deleteOtherTags(path, layoutName);
    }
    /**
     * 关闭除了当前的左边的所有其他标签
     * 固定的除外
     *  */
    function deleteLeftTags_(path) {
        deleteLeftTags(path, layoutName);
    }
    /**
     * 关闭除了当前的左边的所有其他标签
     * 固定的除外
     *  */
    function deleteRightTags_(path) {
        deleteRightTags(path, layoutName);
    }
    /**
     * 获取历史记录里最近的一个标签（不在标签列表中的过滤掉）
     */
    function getLatelyHisTag_() {
        return getLatelyHisTag(layoutName);
    }
    /** 获取右边的一个实例 */
    function getRight_(path) {
        return getRight(path, layoutName);
    }
    function getLeft_(path) {
        return getLeft(path, layoutName);
    }
    return {
        getTag,
        deleteTags,
        formatTagsByUserMenuConfig,
        updateTag,
        refreshTag: refreshTag_,
        deleteOtherTags: deleteOtherTags_,
        deleteLeftTags: deleteLeftTags_,
        deleteRightTags: deleteRightTags_,
        getLatelyHisTag: getLatelyHisTag_,
        getRight: getRight_,
        getLeft: getLeft_,
    };
}
