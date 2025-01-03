/** 用作测试 */
if(require.main === module){
    const {verifieData} = require('./verifiedTools');
    const verifiedOption = {
        name(value,option,otherParams){
            /** 处理不满足条件的值 */
            if(value !== '321') {
                return {
                    message:`key:${option.key} 只能是321`,
                    lang:otherParams.lang,
                };
            }
            return true;
        },
    };
    /** 待验证的数据源 */
    const data = {
        name:'3221',
    };
    const verifiedData = verifieData(
        data,
        verifiedOption,
        {
            lang:'zh',
        },
    );
    /** verifiedData为空表示数据都验证通过了 */
    console.log(verifiedData);
}
