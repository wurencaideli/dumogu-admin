/*jshint esversion: 9 */
/**
 * 用于处理目录的工具
 */

/**
 * 将目录转换为树形结构
 */
export function toTree(
    list = [],
    option = { key: 'id', pKey: 'pid', isNew: true, childsKey: 'childs' },
) {
    const { key, pKey, isNew, childsKey } = option;
    if (isNew) {
        list = JSON.parse(JSON.stringify(list));
    }
    const idMap = {};
    const tree = [];
    list.forEach((item) => {
        idMap[item[key]] = item;
    });
    list.forEach((item) => {
        if (idMap[item[pKey]]) {
            idMap[item[pKey]][childsKey] = idMap[item[pKey]][childsKey] || [];
            idMap[item[pKey]][childsKey].push(item);
        } else {
            tree.push(item);
        }
    });
    return tree;
}
/**
 * 展开树形list结构为一维list
 * @param treeList:array
 * @param option:object
 */
export function unfoldTreeList(treeList, option = {}) {
    const {
        childsKey = 'children', //需要获取子元素的 key
        setParentKey = 'parentId', //需要赋值的父元素 key
        getParentKey = 'id', //获取父元素 key
        forEachFn = null, //循环时的回调
    } = option;
    const deptOneList = [];
    const deepForEach = (target) => {
        deptOneList.push(target);
        forEachFn && forEachFn(target);
        if (target[childsKey]) {
            target[childsKey].forEach((item_) => {
                item_[setParentKey] = target[getParentKey];
                deepForEach(item_);
            });
        }
    };
    treeList.forEach((item) => {
        deepForEach(item);
    });
    return deptOneList;
}
