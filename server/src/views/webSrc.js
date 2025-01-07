/**
 * web资源api，可以分不同的二级路由
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const { getReqlanguage } = require('../i18/index');
const { packageRequestHandler } = require('../common/packageRequestHandler');
const { ResBody } = require('../common/ResBody');
const { getEnv } = require('../env');

/** 获取站点资源 */
getEnv().WEBS.forEach((item) => {
    console.log('添加web静态服务', item.path, item.distDir);
    router.use(item.path, express.static(item.distDir, {
        /**
         * TODO 注意nginx会缓存响应头带有Cache-Control的代理响应，所以对index.html友好
         * 加个proxy_ignore_headers Cache-Control;就行了，让nginx不处理缓存让浏览器处理
         */
        maxAge: '30d', // 设置缓存时间为 30 天
    }));
    router.use(item.path, packageRequestHandler((req, res) => {
        const filePath = path.join(item.distDir, 'index.html');
        res.sendFile(filePath, (err) => {
            if (!err) return;
            res.json(
                new ResBody(404, {
                    msg: `没找到文件 ${item.path} index.html`,
                    lang: getReqlanguage(req),
                }),
            );
        });
    }));
});

module.exports = router;
