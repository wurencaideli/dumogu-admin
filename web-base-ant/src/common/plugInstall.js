/**
 * 插件安装
 * 防止循环依赖
 */

const allPlug = {};

export default {
    /** 插件安装 */
    install(name, instance) {
        allPlug[name] = instance;
    },
    /** 卸载 */
    unInstall(name) {
        delete allPlug[name];
    },
    get(name) {
        return allPlug[name];
    },
};
