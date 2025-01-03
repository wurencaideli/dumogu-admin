/**
 * 文件操作，读写文件
 * 封装好做文件操作限制
 */
const fsExtra = require('fs-extra');
const resourcesTools = require('./resourcesTools');

/** 写文件 */
async function outputFile(filePath,content){
    resourcesTools.filterOperablePathSync(filePath);
    return fsExtra.outputFile(outFilePath, content, 'utf8');
}
/** 读文件 */
async function readFile(filePath){
    resourcesTools.filterOperablePathSync(filePath);
    return fsExtra.readFile(filePath, 'utf8');
}
/** 删除文件，文件夹 */
async function deleteFile(filePath){
    resourcesTools.filterOperablePathSync(filePath);
    return fsExtra.remove(filePath);
}
/** 创建文件夹 */
async function ensureDir(dirPath){
    resourcesTools.filterOperablePathSync(dirPath);
    return fsExtra.ensureDir(dirPath);
}
/** 验证是否是文件，可以不验证目录权限 */
async function isFile(filePath,isStrict=true){
    if(!isStrict){
        resourcesTools.filterOperablePathSync(filePath);
    }
    let state = await fsExtra.stat(filePath).catch(() => false);
    if (!state || !state.isFile()) {
        return false;
    }
    return true;
}

module.exports = {
    outputFile,
    readFile,
    deleteFile,
    ensureDir,
    isFile,
};