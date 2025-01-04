/**
 * web资源api，可以分不同的二级路由
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const resourcesTools = require('../common/resourcesTools');
const { publicReturn } = require('../common/publicReturn');
const { getReqlanguage } = require('../i18/index');
const { packageRequestHandler } = require('../common/packageRequestHandler');

/** 将websrc目录设置为静态目录 */
router.use('/',express.static(resourcesTools.getWebDistRootDir(),{
    /**
     * TODO 注意nginx会缓存响应头带有Cache-Control的代理响应，所以对index.html友好
     * 加个proxy_ignore_headers Cache-Control;就行了，让nginx不处理缓存让浏览器处理
     */
    maxAge: '30d'  // 设置缓存时间为 30 天
}));
/** 获取站点资源 */
const webDistRootPath = path.join(resourcesTools.getWebDistRootDir());
const webDistRootPath_1 = path.join(resourcesTools.getWebDistRootDir(), 'base');
const webDistRootPath_2 = path.join(resourcesTools.getWebDistRootDir(), 'base-naive-ui');
const webDistRootPath_3 = path.join(resourcesTools.getWebDistRootDir(), 'base-ant');
// 自定义中间件，为特定路径返回指定文件
router.use('/base-ant*', packageRequestHandler((req, res) => {
    const filePath = path.join(webDistRootPath_3, 'index.html');
    res.sendFile(filePath, (err) => {
        if (!err) return;
        res.json(new publicReturn(404, {
            msg:'没找到文件 index.html',
            lang:getReqlanguage(req),
        }));
      });
}));
router.use('/base-naive-ui*', packageRequestHandler((req, res) => {
    const filePath = path.join(webDistRootPath_2, 'index.html');
    res.sendFile(filePath, (err) => {
        if (!err) return;
        res.json(new publicReturn(404, {
            msg:'没找到文件 index.html',
            lang:getReqlanguage(req),
        }));
      });
}));
router.use('/base*', packageRequestHandler((req, res) => {
    const filePath = path.join(webDistRootPath_1, 'index.html');
    res.sendFile(filePath, (err) => {
        if (!err) return;
        res.json(new publicReturn(404, {
            msg:'没找到文件 index.html',
            lang:getReqlanguage(req),
        }));
      });
}));
router.use(packageRequestHandler((req, res) => {
    const filePath = path.join(webDistRootPath, 'index.html');
    res.sendFile(filePath, (err) => {
        if (!err) return;
        res.json(new publicReturn(404, {
            msg:'没找到文件 index.html',
            lang:getReqlanguage(req),
        }));
      });
}));

module.exports = router;
