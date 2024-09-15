/**
 * 一些常用的其他函数工具
 */
export function setBaseSize(baseSize) {
    baseSize = Number(baseSize) || 16;
    let fontSize = Math.round(baseSize) + 'px';
    if (document.documentElement.style.fontSize == fontSize) return;
    document.documentElement.style.fontSize = fontSize;
}
/**是否是pc端 */
export function isPc() {
    let userAgent = navigator.userAgent;
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    return !Agents.some((i) => {
        return userAgent.includes(i);
    });
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
            if (!Array.isArray(item)) {
                item = [item];
            }
            const key = item[1] || item[0];
            c[key] = item[0];
            return c;
        }, {});
        Object.keys(fixedTarget).forEach((item) => {
            if (excludeKeyList.includes(item)) return;
            if (mergeKeyMap[item]) {
                target[mergeKeyMap[item]] = fixedTarget[item];
            } else {
                target[item] = fixedTarget[item];
            }
        });
    } else {
        mergeKeyList.forEach((item) => {
            if (!Array.isArray(item)) {
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
    var save = function (e) {
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
export function numberToFixed(value, length = 0) {
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
    return !value && value !== 0;
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
    Object.keys(configMap).forEach((key) => {
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
export function groupList(list = [], rule = [], options = {}) {
    let {
        forEach, //循环时的回调，避免使用时多次调用forEach浪费性能
        isDetailed = false, //表示是详细的，会返回详细的数据
        groupForEach,
        groupPretreat,
        groupByValue = false, //只是根据值分组，相同的值分为一组
        reduce, //归纳，可用作统计相应数据
        reduceValue, //初始值
    } = options;
    const map_ = new Map();
    const dataList_ = [];
    list.forEach((item, index) => {
        if (forEach) {
            forEach(item, index);
        }
        if (reduce) {
            reduceValue = reduce(reduceValue, item, index);
        }
        const sign = groupByValue
            ? item
            : `
            ${rule
                .map((key) => {
                    // 分组标识可以是数组或函数
                    if (typeof key == 'function') {
                        return key(item, index);
                    }
                    return item[key];
                })
                .join('--&&--')}
        `;
        if (map_.has(sign)) {
            map_.get(sign).push(item);
        } else {
            const list_ = [];
            list_.push(item);
            map_.set(sign, list_);
            dataList_.push(list_);
        }
    });
    map_.clear();
    const detailData = {
        list: [], //平铺后的list
        groupList: [],
    };
    dataList_.forEach((list, index) => {
        if (groupForEach) {
            groupForEach(list, index);
        }
        if (groupPretreat) {
            list = groupPretreat(list, index);
        }
        detailData.groupList.push(list);
        detailData.list.push(...list);
    });
    if (!isDetailed) return detailData.groupList;
    return detailData;
}
/**
 *
 * 生成从minNum到maxNum的随机数
 */
export function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
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
        return 'https://' + _list[0] + '/favicon.ico';
    } else {
        return link;
    }
}
/** 是否是生产环境 */
export function isProdoction() {
    return import.meta.env.PROD;
}
/** 是否是生产环境 */
export function isProd() {
    return import.meta.env.PROD;
}
/**
 * 获取dict单个数据
 */
export function getDictItem(dictList, value, option = {}) {
    const { valueKey = 'value', isCongruence = false } = option;
    return dictList.find((item) => {
        /** 是否用全等操作 */
        if (isCongruence) {
            return item[valueKey] === value;
        } else {
            return item[valueKey] == value;
        }
    });
}
/**
 * 获取dict的value对应的label
 */
export function getDictItemLabel(target, value, option = {}) {
    const {
        valueKey = 'value',
        lebelKey = 'label',
        showValue = true,
        isCongruence = false,
    } = option;
    let item = getDictItem(target, value, { valueKey: valueKey, isCongruence: isCongruence });
    if (item) {
        return item[lebelKey];
    } else if (showValue) {
        //如果没找到item的化直接返回value
        return value;
    } else {
        return '';
    }
}
/** 全屏事件 */
export function toggleFullScreen() {
    var elem = document.documentElement; // 获取文档根元素
    if (
        !document.fullscreenElement && // 当前不在全屏模式
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
    ) {
        // 也适用于IE/Edge
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            // Chrome, Safari, and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            // IE/Edge
            elem.msRequestFullscreen();
        }
    } else {
        // 当前在全屏模式，退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            // Chrome, Safari, and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            // IE/Edge
            document.msExitFullscreen();
        }
    }
}
/** 获取数据的类型 */
export function getTypeOf(value) {
    return Object.prototype.toString.call(value);
}
/** 去除首尾空格 */
export function toTrim(str) {
    str = (str || '').replace(/^\s+|\s+$/g, '');
    return str;
}
