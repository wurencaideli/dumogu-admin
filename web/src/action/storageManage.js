/**
 * 缓存对象管理
 * 防止对象过多
 */
import StorageS from 'storages-js';

/**
 * 所有实例
 * 公共管理
 *  */
const allStorage = {};
function createS(key, value) {
    if (!allStorage[key]) {
        allStorage[key] = new StorageS(key, value, { modelName: 'local' });
    }
    return allStorage[key];
}

/** 保存用户的基本信息 */
const userStorage = (value) => {
    return createS('user-container', value);
};
/** 保存标签页的标签信息 */
const tagsMapStorage = (value) => {
    return createS('tags-map-container', value);
};
/** 保存memu的隐藏信息信息 */
const showMenuStorage = (value) => {
    return createS('show-menu-container', value);
};

export default {
    userStorage,
    showMenuStorage,
    tagsMapStorage,
};
