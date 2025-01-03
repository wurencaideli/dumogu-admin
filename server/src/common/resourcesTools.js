/**
 * 限制资源的一些函数
 */
const path = require('path');
const otherTools = require('./otherTools');

/** 项目根目录 */
const rootPath = path.join(__dirname, '../../');
const dataRootDir = otherTools.isPro() ? path.join(rootPath, 'data-pro') : path.join(rootPath, 'data');
function getRootDir(){
    return rootPath;
}
/**
 * 获取可操作的文件夹路径，主要是用来储存数据以及其他的杂七杂八的文件
 */
function getDataRootDir() {
    return dataRootDir;
}
/**
 * 是否是项目中的子目录
 * @param {string} inputPath
 * @returns {boolean}
 */
function isRootChildPath(inputPath) {
    let normalizedPath = path.normalize(inputPath);
    return normalizedPath.startsWith(rootPath);
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
/**
 * 是否是可操作的路径，只有满足条件的路径才允许读写操作
 * 防止代码中错误的读写文件
 * 代码中的可操作的文件夹只有根目录下的data/和data-pro/ 目录
 * @param {string} inputPath
 * @returns {boolean}
 */
function filterOperablePathSync(inputPath) {
    let dataPath = getDataRootDir();
    let normalizedPath = path.normalize(inputPath);
    const state = normalizedPath.startsWith(dataPath);
    if (!state) throw `不允许的操作路径: ${inputPath}`;
    return inputPath;
}
function filterOperablePath(inputPath) {
    return new Promise((r, j) => {
        try {
            r(filterOperablePathSync(inputPath));
        } catch (error) {
            j(error);
        }
    });
}

module.exports = {
    getRootDir,
    isRootChildPath,
    filterOperablePath,
    filterOperablePathSync,
    getDataRootDir,
    isDataRootChildPath,
};
