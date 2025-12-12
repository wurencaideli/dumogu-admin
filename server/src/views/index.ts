import express from 'express';
import compression from 'compression';

import { packageRequestHandler } from '../action/api-middleware.js';
import { publicReturn } from '../common/public-return.js';
import { createRouter as createPublicRouter } from './public/index.js';
import { createRouter as createWebRouter } from './web/index.js';

export function createRouter() {
    const router = express.Router();
    /** 公共接口 */
    router.use('/api/public', compression(), createPublicRouter());
    /** 处理接口404 */
    router.use(
        '/api',
        packageRequestHandler((req: any, res: any) => {
            res.json(new publicReturn(404, '什么也没找到'));
        }),
    );
    /** web 主接口 */
    router.use('/', createWebRouter());
    return router;
}
