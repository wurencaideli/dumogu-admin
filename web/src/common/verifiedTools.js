/**
 * 验证工具
 * 用作验证数据
 */

/**
 * verifiedData
 * 验证一个数据的合法性
 * data:object
 * options:object
 * 例子
 *  verifiedData({number:0},{
        number:{
            state:true,
            validate(value,option){
                return true; 
            },
        },
    });
 */
export function verifiedData(data = {}, options = {}) {
    const failList = [];
    if (Array.isArray(options)) {
        options.forEach((item) => {
            if (!item || !item.validate || !item.key) return;
            const validateFn = item.validate;
            if (!!validateFn(data[item.key], item)) return;
            failList.push(item);
        });
    } else {
        const keys = Object.keys(options);
        keys.forEach((item) => {
            const option = options[item];
            if (!option || !option.validate) return;
            const validateFn = option.validate;
            if (!!validateFn(data[item], option)) return;
            failList.push({
                ...option,
                key: item,
            });
        });
    }
    return failList.length == 0 ? undefined : failList;
}
