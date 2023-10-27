/** 
 * 路由全局工具
 * 包括系统的完整目录菜单
 */
import router from './index';/** 挂载到全局方便操作 */

/** 
 * 系统完整目录列表
 * 目录的name表示唯一名称
 * 注意，目录名是唯一区分目录的标识，因为path是属于memu的子集
 * 就是说，一个目录可能产生多个不同的path（使用的组件相同）
 *  */
export let sysMeluList = router.getRoutes().filter(item=>{
    return !!item.meta && item.meta.isMenu && !!item.name;
}).map(item=>{
    return {
        name:item.name,
        path:item.path,
    };
});
/** 目录name的map，方便查询 */
export let sysMeluNameMap = sysMeluList.reduce((c,i)=>{
    c[i.name] = i;
    return c;
},{});
/** 目录path的map，方便查询 */
export let sysMeluPathMap = sysMeluList.reduce((c,i)=>{
    c[i.path] = i;
    return c;
},{});

