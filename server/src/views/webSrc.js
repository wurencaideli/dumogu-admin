/**
 * web资源api，可以分不同的二级路由
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const fileTools = require('../common/fileTools');
const resourcesTools = require('../common/resourcesTools');
const { publicReturn } = require('../common/publicReturn');
const { getReqlanguage } = require('../i18/index');
const { packageRequestHandler } = require('../common/packageRequestHandler');

/** 处理指定文件目录下的资源 */
async function handleWebSrc(dirPath,filePath,req,res){
    /** 保证路径必须是dirPath内的子目录 */
    if (!filePath.startsWith(dirPath)) {
        res.json(new publicReturn(403, {
            msg:'错误的文件路径<i-s>:<i-s>'+ req.url,
            lang:getReqlanguage(req),
        }));
        return;
    }
    /** 找不到文件默认返回index.html */
    let isFile = await fileTools.isFile(filePath).catch(() => false);
    if (!isFile) {
        filePath = path.join(dirPath, '/index.html');
    }
    res.set({
        'Content-Type': mime.getType(filePath),
    });
    res.setHeader('Cache-Control', 'public, max-age=604800'); // 设置缓存，7 天的秒数
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
        res.json(new publicReturn(404, {
            msg:'什么也没找到',
            lang:getReqlanguage(req),
        }));
    });
    stream.pipe(res);
}
/** 获取站点资源 */
const webDistRootPath_1 = path.join(resourcesTools.getDataRootDir(), 'web-base');
router.get(
    '/base*',
    packageRequestHandler(async function (req, res) {
        let filePath = req.path;
        filePath = filePath.substring('/base'.length);
        filePath = path.join(webDistRootPath_1, filePath);
        await handleWebSrc(webDistRootPath_1,filePath,req, res);
    }),
);
/** 获取站点资源 */
const webDistRootPath_2 = path.join(resourcesTools.getDataRootDir(), 'web-base-naive-ui');
router.get(
    '/base-naive-ui*',
    packageRequestHandler(async function (req, res) {
        let filePath = req.path;
        filePath = filePath.substring('/base-naive-ui'.length);
        filePath = path.join(webDistRootPath_2, filePath);
        await handleWebSrc(webDistRootPath_2,filePath,req, res);
    }),
);
/** 获取站点资源 */
const webDistRootPath_3 = path.join(resourcesTools.getDataRootDir(), 'web-base-ant');
router.get(
    '/base-ant*',
    packageRequestHandler(async function (req, res) {
        let filePath = req.path;
        filePath = filePath.substring('/base-ant'.length);
        filePath = path.join(webDistRootPath_3, filePath);
        await handleWebSrc(webDistRootPath_3,filePath,req, res);
    }),
);
/** 获取站点资源 */
const webDistRootPath = path.join(resourcesTools.getDataRootDir(), 'web');
router.get(
    '/*',
    packageRequestHandler(async function (req, res) {
        let filePath = path.join(webDistRootPath, req.path);
        await handleWebSrc(webDistRootPath,filePath,req, res);
    }),
);

module.exports = router;
