/**
 * 复制一些对象属性到另一个对象上
 */
/** 
 * 简单复制，base函数
 * @param {{}} [data={}] 需要复制的对象
 * @param {{}} [dataOrigin={}] 数据源对象
 * @param {[]} [copyKeyList={}] 需要复制的key数组，可以是['123'] || [['123','1234']]
 */
function copySimple(data, dataOrigin, copyKeyList = []){
    copyKeyList.forEach((item) => {
        if (!Array.isArray(item)) {
            item = [item];
        }
        /** item:['key','key1'] 将源对象的key1复制到对象的key */ 
        if (item.length == 1) {
            data[item[0]] = dataOrigin[item[0]];
        } else {
            data[item[0]] = dataOrigin[item[1]];
        }
    });
    return data;
}
/** 
 * 复制属性，设置别名
 * @param {{}} [data={}] 需要复制的对象
 * @param {{}} [dataOrigin={}] 数据源对象
 * @param {{} || []} [options={}] 配置，可以是['123'] || [['123','1234']]
 * @returns {{}} 返回数据
 */
function copyAttributes(data, dataOrigin, option = {}){
    let copyKeyList = []; //需要复制的key  ['123']或者[['123']]
    let excludeKeyList = []; //复制时需要排除的 key
    let copyAll = false; //是否复制源对象的所有key
    if (Array.isArray(option)) {
        copyKeyList = option;
    } else {
        copyKeyList = option.copyKeyList || [];
        excludeKeyList = option.excludeKeyList || [];
        copyAll = !!option.copyAll;
    }
    if(copyAll){
        const copyKeyList_ = Object.keys(dataOrigin);
        excludeKeyMap = excludeKeyList.reduce((i,c)=>{
            i[c] = true;
            return i;
        },{});
        return copySimple(data,dataOrigin,copyKeyList_.concat(copyKeyList).filter(key=>{
            if (!Array.isArray(key)) {
                key = [key];
            }
            /** 优先使用key[1]判断，因为这才是需要从数据源复制的属性 */
            return !excludeKeyMap[key[1] || key[0]];
        }));
    }
    return copySimple(data,dataOrigin,copyKeyList);
}
/** 
 * 根据配置信息复制对象
 * @param {{}} [data={}] 需要复制的对象
 * @param {{}} [dataOrigin={}] 数据源对象
 * @param {{}} [options={}] 需要复制的key的配置
 * @param {{}} [config={}] 此次复制的配置
 * @returns {{}} 返回数据
 */
function copyDefaults(data = {}, dataOrigin = {},options={},config={}) {
    const isStrict = !!config.strict;  // 严格模式，此模式下只会复制有option的key
    const dataOrginKeys = Object.keys(dataOrigin);
    const optionKeys = Object.keys(options);
    /** 遍历源对象，将部分属性复制到data上 */
    dataOrginKeys.concat(optionKeys).forEach((key) => {
        const hasOwnKey = dataOrigin.hasOwnProperty(key);
        const hasOptionsKey = options.hasOwnProperty(key);
        if(hasOptionsKey && hasOwnKey){
            data[key] = dataOrigin[key];
            return;
        }
        if(hasOwnKey){
            if(isStrict) return;  // 严格模式下没有配置不允许复制
            data[key] = dataOrigin[key];
            return;
        }
        if( !hasOptionsKey) return;
        if (typeof options[key].default == 'function') {
            data[key] = options[key].default();
        } else {
            data[key] = options[key].default;
        }
    });
    return data;
}

module.exports = {
    copySimple,
    copyAttributes,
    copyDefaults,
};
