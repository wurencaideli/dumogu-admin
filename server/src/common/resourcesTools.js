const path = require('path');

/**
 * 获取项目根目录
 * @returns {string}
 */
function getRootDir() {
    return process.env.DUMOGU_RootDir;
}
/**
 * 是否是项目中的子目录
 * @param {string} inputPath
 * @returns {boolean}
 */
function isRootChildPath(inputPath) {
    let normalizedPath = path.normalize(inputPath);
    return normalizedPath.startsWith(getRootDir());
}
/** web资源目录 */
function getServerRootDir() {
    return process.env.DUMOGU_ServerRootDir;
}
/**
 * 是否是web资源目录子目录
 * @param {string} inputPath
 * @returns {boolean}
 */
function isServerRootChildPath(inputPath) {
    let normalizedPath = path.normalize(inputPath);
    return normalizedPath.startsWith(getServerRootDir());
}
/**
 * 获取可操作的文件夹路径，主要是用来储存数据以及其他的杂七杂八的文件
 */
function getServerDataRootDir() {
    return process.env.DUMOGU_ServerDataRootDir;
}
/**
 * 是否是数据中的子目录
 * @param {string} inputPath
 * @returns {boolean}
 */
function isServerDataRootChildPath(inputPath) {
    let normalizedPath = path.normalize(inputPath);
    return normalizedPath.startsWith(getServerDataRootDir());
}

module.exports = {
    getRootDir,
    isRootChildPath,
    getServerRootDir,
    isServerRootChildPath,
    getServerDataRootDir,
    isServerDataRootChildPath,
};
