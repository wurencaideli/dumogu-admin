/** 用作测试 */
if(require.main === module){
    const {
        copySimple,
        copyAttributes,
        copyDefaults,
    } = require('./copyDefaults');
    /** 复制简单属性 */
    console.log(copySimple(
        {a:2},
        {a:3},
        ['a',['b','a']],
    ));
    /** 可配置排除键 */
    console.log(copyAttributes(
        {a:2},
        {a:3,c:4,d:2},
        {
            copyKeyList:['a',['b','a'],['c']],
            excludeKeyList:['c'],
            copyAll:true,
        },
    ));
    /** 非严格模式，允许复制源对象中其他键 */
    console.log(copyDefaults(
        {a:2},
        {a:3,c:4,d:2},
        {
            n:{
                default:200,
            },
            m:{
                default:()=>{
                    return new Date().getTime();
                },
            },
        },
        {
            strict:false,
        },
    ));
    /** 严格模式 */
    console.log(copyDefaults(
        {a:2},
        {a:3,c:4,d:2},
        {
            n:{
                default:200,
            },
            m:{
                default:()=>{
                    return new Date().getTime();
                },
            },
        },
        {
            strict:true,
        },
    ));
}
