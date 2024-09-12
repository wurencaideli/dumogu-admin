/**
 * 标签数组的操作
 * 包含刷新当前标签页，操作标签数组，添加删除标签数组
 */
import { userDataStore } from '@/store/user';
import router from '@/router';
import { deepCopyObj } from '@/common/otherTools';

export default function generateTagListTools(layoutName_) {
    let layoutName = layoutName_ || '';
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
     * 刷新指定标签页
     * path 标签唯一标识
     * refreshAll 是否刷新全部标签
     *  */
    function refreshTag(path, refreshAll = false) {
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
     * 关闭除了当前的所有其他标签
     * 固定的除外
     *  */
    function deleteOtherTags(path) {
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
    function deleteLeftTags(path) {
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
    function deleteRightTags(path) {
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
    function getLatelyHisTag() {
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
    /**
     * 格式化标签列表
     * 与目录重新建立关系，相当于更新了一下标签
     *  */
    function formatTagsByUserMenu() {
        let userData = userDataStore();
        let tagList = deepCopyObj(userData.tagList);
        let userMenuConfigMap = userData.userMenuConfigMap;
        let tagList_ = [];
        tagList.forEach((item) => {
            /** 优先取path */
            let userMenuConfig = userMenuConfigMap[item.path] || userMenuConfigMap[item.name];
            /** 有目录权限的才更新*/
            if (!userMenuConfig) return;
            item = Object.assign(item, userMenuConfig);
            tagList_.push(item);
        });
        userData.setTagList(tagList_);
    }
    /** 获取右边的一个实例 */
    function getRight(path) {
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
    function getLeft(path) {
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
    return {
        getTag,
        deleteTags,
        refreshTag,
        updateTag,
        deleteOtherTags,
        deleteLeftTags,
        deleteRightTags,
        getLatelyHisTag,
        formatTagsByUserMenu,
        getRight,
        getLeft,
    };
}
