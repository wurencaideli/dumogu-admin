import express from 'express';
import path from 'path';

import { publicReturn } from '../../common/public-return.js';
import { getGlobalVariables } from '../../action/setup-global-variables.js';
import { packageRequestHandler } from '../../action/api-middleware.js';

export function createRouter() {
    const router = express.Router();
    const serverRootDirPath = getGlobalVariables('serverRootDirPath');
    const webDistDirPath = path.join(serverRootDirPath, '../web/dist');
    const webBaseDistDirPath = path.join(serverRootDirPath, '../web-base/dist');
    const webBaseNaiveUiDistDirPath = path.join(serverRootDirPath, '../web-base-naive-ui/dist');
    const webBaseAntDistDirPath = path.join(serverRootDirPath, '../web-base-ant/dist');
    [
        { path: '/base-naive-ui', dir: webBaseNaiveUiDistDirPath },
        { path: '/base-ant', dir: webBaseAntDistDirPath },
        { path: '/base', dir: webBaseDistDirPath },
        { path: '/', dir: webDistDirPath },
    ].forEach((item) => {
        router.use(
            item.path,
            express.static(item.dir, {
                maxAge: '9999d', // 缓存时间为 9999 天
                index: false,
            }),
        );
        router.use(
            item.path,
            packageRequestHandler((req: any, res: any) => {
                res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
                const filePath = path.join(item.dir, 'index.html');
                res.sendFile(filePath, (err: any) => {
                    if (!err) return;
                    res.json(new publicReturn(404, '没找到文件 /index.html'));
                });
            }),
        );
    });
    return router;
}
