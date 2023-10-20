/** 
 * 路由全局工具
 * 包括系统的完整目录菜单
 */
import router from './index';/** 挂载到全局方便操作 */

/** 系统完整目录列表 */
export let sysMeluList = router.getRoutes().filter(item=>{
    return !!item.meta && item.meta.isMenu && !!item.name;
}).map(item=>{
    return {
        name:item.name,
        path:item.path,
        meta:item.meta,
    };
});
export let sysMeluNameMap = sysMeluList.reduce((c,i)=>{
    c[i.name] = i;
    return c;
},{});

