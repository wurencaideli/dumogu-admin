import StorageS from 'storages-js';

/**
 * 所有实例
 * 公共管理
 */
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
const fullScreenStorage = (value) => {
    return createS('full-screen-container', value);
};

export default {
    userStorage,
    fullScreenStorage,
};
