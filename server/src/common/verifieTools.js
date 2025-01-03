/**
 * 验证工具，用作验证数据
 */

/**
 * 验证一个数据的合法性，自行写判断函数，只给出一个架子
 * @param {{}} [data={}] 
 * @param {{}} [options={}] 
 * @param {...*} params 作为全局参数传给验证函数
 */
function verifieData(data = {}, options = {}, ...params) {
    const failList = [];
    const keys = Object.keys(options);
    keys.forEach((item) => {
        const validate = options[item];
        if (!validate || Object.prototype.toString.call(validate) !== '[object Function]') return;
        const result = validate(data[item],{
            key:item,
        },...params);  // 调用验证函数，并传入配置参数，全局参数
        if(result === true) return;  // 必须返回true表示验证成功
        failList.push(result);
    });
    return failList.length == 0 ? undefined : failList;
}

module.exports = {
    verifieData,
};
