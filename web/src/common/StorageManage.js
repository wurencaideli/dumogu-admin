/**
 * 缓存对象管理
 * 防止对象过多
 */
import StorageS from 'storages-js';

/** 所有实例 */
const allStorage = {};
function createS(key,value){
    if(!allStorage[key]){
        allStorage[key] = new StorageS(key,value,{modelName:'local'});
    }
    return allStorage[key];
}

/** 保存用户的基本信息 */
const userStorage = ()=>{
    return createS('user-container','');
}
/** 保存 历史背景图片记录 */
const hisImgStorage = ()=>{
    return createS('his-img-container','');
}

export default {
    userStorage,
    hisImgStorage,
};