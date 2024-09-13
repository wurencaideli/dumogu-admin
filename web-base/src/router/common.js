/**
 * 路由全局工具
 * 包括系统的完整目录菜单
 */
import router from './index'; /** 挂载到全局方便操作 */

/**
 * 系统完整目录配置列表
 * 目录的name表示唯一名称
 * 注意，目录名是唯一区分目录的标识，因为path是属于memu的子集
 * 就是说，一个目录可能产生多个不同的path（使用的组件相同）
 *  */
export let sysMeluConfigList = router
    .getRoutes()
    .filter((item) => {
        return !!item.name || !!item.path;
    })
    .map((item) => {
        return Object.assign(
            {},
            {
                name: item.name,
                path: item.path,
            },
            item.meta || {},
        );
    });
/** 目录name的map，方便查询 */
export let sysMeluConfigNameMap = sysMeluConfigList.reduce((c, i) => {
    if (i.name) {
        c[i.name] = i;
    }
    return c;
}, {});
/** 目录path的map，方便查询 */
export let sysMeluConfigPathMap = sysMeluConfigList.reduce((c, i) => {
    if (i.path) {
        c[i.path] = i;
    }
    return c;
}, {});
