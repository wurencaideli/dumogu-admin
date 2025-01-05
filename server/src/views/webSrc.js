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

/** 获取站点资源 */
[
    {
        r: '/base-naive-ui',
        path: path.join(resourcesTools.getRootDir(), './web-base-naive-ui/dist'),
    },
    { r: '/base-ant', path: path.join(resourcesTools.getRootDir(), './web-base-ant/dist') },
    { r: '/base', path: path.join(resourcesTools.getRootDir(), './web-base/dist') },
    { r: '/', path: path.join(resourcesTools.getRootDir(), './web/dist') },
].forEach((item) => {
    const params = [express.static(item.path, {
        /**
         * TODO 注意nginx会缓存响应头带有Cache-Control的代理响应，所以对index.html友好
         * 加个proxy_ignore_headers Cache-Control;就行了，让nginx不处理缓存让浏览器处理
         */
        maxAge: '30d', // 设置缓存时间为 30 天
    })];
    if(item.r){
        params.unshift(item.r);
    }
    router.use(...params);
});
[
    {
        r: '/base-naive-ui*',
        path: path.join(resourcesTools.getRootDir(), './web-base-naive-ui/dist'),
    },
    { r: '/base-ant*', path: path.join(resourcesTools.getRootDir(), './web-base-ant/dist') },
    { r: '/base*', path: path.join(resourcesTools.getRootDir(), './web-base/dist') },
    { r: '', path: path.join(resourcesTools.getRootDir(), './web/dist') },
].forEach((item) => {
    const params = [packageRequestHandler((req, res) => {
        const filePath = path.join(item.path, 'index.html');
        res.sendFile(filePath, (err) => {
            if (!err) return;
            res.json(
                new publicReturn(404, {
                    msg: `没找到文件 ${item.r} index.html`,
                    lang: getReqlanguage(req),
                }),
            );
        });
    })];
    if(item.r){
        params.unshift(item.r);
    }
    router.use(...params);
});

module.exports = router;
