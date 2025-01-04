/**
 * 限制资源的一些函数
 */
const path = require('path');

const rootDir = process.env.DUMOGU_RootDir; // 项目根目录
const dataRootDir = process.env.DUMOGU_dataRootDir; // 服务缓存的文件目录
const webDistRootDir = process.env.DUMOGU_webDistRootDir; // web资源目录
/**
 * 获取项目根目录
 * @returns {string}
 */
function getRootDir() {
    return rootDir;
}
/**
 * 是否是项目中的子目录
 * @param {string} inputPath
 * @returns {boolean}
 */
function isRootChildPath(inputPath) {
    let normalizedPath = path.normalize(inputPath);
    return normalizedPath.startsWith(rootDir);
}
/**
 * 获取可操作的文件夹路径，主要是用来储存数据以及其他的杂七杂八的文件
 */
function getDataRootDir() {
    return dataRootDir;
}
/**
 * 是否是数据中的子目录
 * @param {string} inputPath
 * @returns {boolean}
 */
function isDataRootChildPath(inputPath) {
    let normalizedPath = path.normalize(inputPath);
    return normalizedPath.startsWith(dataRootDir);
}
/** web资源目录 */
function getWebDistRootDir() {
    return webDistRootDir;
}
/**
 * 是否是web资源目录子目录
 * @param {string} inputPath
 * @returns {boolean}
 */
function isWebDistRootChildPath(inputPath) {
    let normalizedPath = path.normalize(inputPath);
    return normalizedPath.startsWith(webDistRootDir);
}

module.exports = {
    getRootDir,
    isRootChildPath,
    getDataRootDir,
    isDataRootChildPath,
    getWebDistRootDir,
    isWebDistRootChildPath,
};
