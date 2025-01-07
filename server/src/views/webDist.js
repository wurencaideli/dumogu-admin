import express from "express";
import { getEnv } from "../env";
import { packageRequestHandler } from "../common/packageRequestHandler";
import path from "path";
import { ResBody } from "../common/ResBody";
import { getReqlanguage } from "../i18";

export function getWebDistRouter() {
    const router = express.Router();
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
    return router;
} 
