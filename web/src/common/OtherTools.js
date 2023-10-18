/**
 * 一些常用的其他函数工具
 */
export function setBaseSize(baseSize) { 
    baseSize = Number(baseSize) || 16;
    let fontSize = Math.round(baseSize) + 'px';
    if(document.documentElement.style.fontSize == fontSize) return;
    document.documentElement.style.fontSize = fontSize;
}
/**是否是pc端 */
export function isPc() {
    let userAgent = navigator.userAgent;
    let Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
    return !(Agents.some((i)=>{
        return userAgent.includes(i);
    }));
}
/** 
 * 对象属性合并（浅合并） 
 * return obj
 *  example 1
 *  const needMergeFiled = [ 
        ['name','name1'],
    ];
    mergeObjProperty(formData.form,clue,needMergeFiled);
    example 2，合并所有键时才可以指定排除键，以及以待合并的对象属性为遍历对象
    mergeObjProperty({},{a:1,b:2},{
        mergeAll:true,
        excludeKeyList:['a'],
        mergeKeyList:[['test','b']],
    });
 */
export function mergeObjProperty(target, fixedTarget, option = {}) {
    let mergeKeyList = []; //需要合并的key  ['123']或者[['123']]
    let excludeKeyList = []; //合并时需要排除的 key
    let mergeAll = false; //是否合并fixed对象的所有key
    if (Array.isArray(option)) {
        mergeKeyList = option;
    } else {
        mergeKeyList = option.mergeKeyList || [];
        excludeKeyList = option.excludeKeyList || [];
        mergeAll = !!option.mergeAll;
    }
    if (mergeAll) {
        const mergeKeyMap = mergeKeyList.reduce((c, item) => {
            if(!Array.isArray(item)){
                item = [item];
            }
            const key = item[1] || item[0];
            c[key] = item[0];
            return c;
        }, {});
        Object.keys(fixedTarget).forEach(item => {
            if (excludeKeyList.includes(item)) return;
            if (mergeKeyMap[item]) {
                target[mergeKeyMap[item]] = fixedTarget[item];
            } else {
                target[item] = fixedTarget[item];
            }
        });
    } else {
        mergeKeyList.forEach(item => {
            if(!Array.isArray(item)){
                item = [item];
            }
            if (item.length == 1) {
                target[item[0]] = fixedTarget[item[0]];
            } else {
                target[item[0]] = fixedTarget[item[1]];
            }
        });
    }
    return target;
}
/**
 * 深度复制一个对象
 * 最简单的实现方式
 */
export function deepCopyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * copy value
 * 数据粘贴板复制
 */
export function copyValue(value) {
    var save = function(e) {
        e.clipboardData.setData('text/plain', value);
        e.preventDefault(); //阻止默认行为
    };
    document.addEventListener('copy', save);
    document.execCommand('copy');
    document.removeEventListener('copy', save);
}
/**
 * 数字四舍五入
 * value:number
 * length:number
 */
export function numberToFixed(value, length=0) {
    value = Number(value);
    return Number(Number.prototype.toFixed.call(value, length));
}
/**
 * 判断文件是否可预览
 * @param {*} fileName
 */
export function getFilePreviewState(fileName) {
    let types = fileName.split('.');
    let type = types[types.length - 1];
    return 'png|jpg|pdf'.indexOf(type) !== -1;
}
/** 是空的*/
export function isEmpty(value) {
    return (!value && value !== 0);
}
/** 
 * 根据配置信息初始化对象
 * 如果 option 有该属性则使用该属性，没有则初始化
 * configMap example
 *  const configMap = {
        //配置信息，初始化时使用
        open: {
            default: false,
        },
        title: {
            default: '入库',
        },
        afterTitle: {
            default: '',
        },
        isShow: {
            //是否只是展示
            default: false,
        },
    };
 */
export function initDataByConfig(data = {}, configOption = {}, configMap = {}) {
    configOption = configOption || {};
    Object.keys(configMap).forEach(key => {
        //初始化一些配置信息
        if (Object.prototype.hasOwnProperty.call(configOption, key)) {
            data[key] = configOption[key];
        } else {
            if (typeof configMap[key].default == 'function') {
                data[key] = configMap[key].default();
            } else {
                data[key] = configMap[key].default;
            }
        }
    });
    return data;
}
/** 
 * 获取uuid(全局唯一标识)
 * 原文地址 https://juejin.cn/post/7066608015784280072
 */
export function getUuid() {
    if (typeof crypto === 'object') {
        if (typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
            const callback = c => {
                const num = Number(c);
                return (
                    num ^
                    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))
                ).toString(16);
            };
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, callback);
        }
    }
    let timestamp = new Date().getTime();
    let perforNow =
        (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let random = Math.random() * 16;
        if (timestamp > 0) {
            random = (timestamp + random) % 16 | 0;
            timestamp = Math.floor(timestamp / 16);
        } else {
            random = (perforNow + random) % 16 | 0;
            perforNow = Math.floor(perforNow / 16);
        }
        return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
    });
}
/** 
 * 数组分组
 *  例子
    let list = [{test:1},{test:2}];
    groupList(list,['test']);  根据 test 字段分组
 *  例子2
    let list = [{test:1},{test:2}];
    groupList(list,['test',(item,index)=>{return 1}],{
        isDetailed:true,
        groupPretreat(list){
            list.push({});
            return list;
        },
    });
 */
export function groupList(list=[],rule=[],options={}){
    let {
        forEach,  //循环时的回调，避免使用时多次调用forEach浪费性能
        isDetailed=false,  //表示是详细的，会返回详细的数据
        groupForEach,
        groupPretreat,
        groupByValue=false,  //只是根据值分组，相同的值分为一组
        reduce,  //归纳，可用作统计相应数据
        reduceValue,  //初始值
    } = options;
    const map_ = new Map();
    const dataList_ = [];
    list.forEach((item,index)=>{
        if(forEach){  
            forEach(item,index);
        }
        if(reduce){  
            reduceValue = reduce(reduceValue,item,index);
        }
        const sign = groupByValue?item:`
            ${rule.map(key=>{
                // 分组标识可以是数组或函数
                if(typeof key == 'function'){  
                    return key(item,index);
                }
                return item[key];
            }).join('--&&--')}
        `;
        if(map_.has(sign)){
            map_.get(sign).push(item);
        }else{
            const list_ = [];
            list_.push(item);
            map_.set(sign,list_);
            dataList_.push(list_);
        }
    });
    map_.clear();
    const detailData = {
        list:[],  //平铺后的list
        groupList:[],  
    };
    dataList_.forEach((list,index)=>{
        if(groupForEach){
            groupForEach(list,index);
        }
        if(groupPretreat){
            list = groupPretreat(list,index);
        }
        detailData.groupList.push(list);
        detailData.list.push(...list);
    });
    if(!isDetailed) return detailData.groupList;
    return detailData;
}
/** 
 * 格式化网址列表
 * 会改变原数组，谨慎使用，或者传入参数时自行提前处理
 *  */
export function formatWebsiteList(list,order){
    list.sort(function (a, b) {
        // 按添加时间排序，新添加的排后面
        return (Number(a.initDate) || 0) - (Number(b.initDate) || 0);
    });
    if(order && order.length !== 0){  //没有order自然是不排序
        const hasOrderList = [];  //有顺序的
        const noHasOrderList = [];  //没有顺序的 
        list.forEach(item=>{
            let index = order.indexOf(String(item.idU || item.id));
            if(index != -1){
                hasOrderList[index] = item;
            }else{
                noHasOrderList.push(item);
            }
        });
        list =  hasOrderList.concat(noHasOrderList);
    }; 
    /** 数组分组 */
    const typeList = [];
    const typeMap = {};
    list.forEach(item=>{
        if(!item) return;
        if(!item.type) return;
        const type = item.type;
        if(!typeList.includes(type)){
            typeList.push(type);
        }
        typeMap[type] = typeMap[type] || [];
        typeMap[type].push(item);
    });
    return {
        typeList,typeMap,
    };
}
/**
 * color 转换
 * @param {*} hex 
 */
export function colorHexToRgb(hex){
    var hexNum = hex.substring(1);
    hexNum = '0x' + (hexNum.length < 6 ? repeatLetter(hexNum, 2) : hexNum);
    var r = hexNum >> 16;
    var g = hexNum >> 8 & '0xff';
    var b = hexNum & '0xff';
    return `rgb(${r},${g},${b})`;
    function repeatWord(word, num){
        var result = '';
        for(let i = 0; i < num; i ++){
            result += word;
        }
        return result;
    }
    function repeatLetter(word, num){
        var result = '';
        for(let letter of word){
            result += repeatWord(letter, num);
        }
        return result;
    }
}
/**
 * 颜色转换
 * @param {*} color 
 */
export function colorRgbToHex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}
/**
 * color格式是否是 hex
 * @param {*} rgb 
 */
export function isColorHex(color){
    return String(color).includes('#');
}
/**
 * 
 * @param {判断颜色是否为亮色} rgb 
 */
export function isLight(rgb){ 
    rgb = String(rgb) || '';
    if(isColorHex(rgb)){
        rgb = colorHexToRgb(rgb);
    }
    let rgbValue = rgb.replace("rgb(", "").replace(")", "");
    let rgbValueList = rgbValue.split(',');
    return (rgbValueList[0] * 0.213 + rgbValueList[1] * 0.715 + rgbValueList[2] * 0.072)>(225/2);
}
/**
 * 
 * 生成从minNum到maxNum的随机数
 */
export function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        default: 
            return 0; 
    } 
}
/**
 * 加载脚本,样式
 *  */ 
export function loadScript(url, type) {
    return new Promise((r, j) => {
        let el;
        switch (type) {
            case 'css':
                el = document.createElement('link');
                el.rel = 'stylesheet';
                el.href = url;
                break;
            case 'js':
                el = document.createElement('script');
                el.type = 'text/javascript';
                el.src = url;
                break;
        }
        document.head.appendChild(el);
        el.onload = () => {
            r();
        };
        el.onerror = () => {
            j();
        };
    });
}
/** 根据链接获取网站图标 */
export function getIcon(link) {
    if (!link) return link;
    let urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    let _list = urlReg.exec(link);
    if (_list && _list.length > 0) {
        return "https://" + _list[0] + "/favicon.ico";
    } else {
        return link;
    }
}
/** 是否是生产环境 */
export function isProdoction(){ 
    return process.env.NODE_ENV === "production";
}