import express from 'express';

import { packageRequestHandler } from '../../action/api-middleware.js';
import { create as captchaCreate } from '../../common/captcha.js';
import { publicReturn } from '../../common/public-return.js';
import { getReqLimiter } from '../../action/req-limiter.js';

export function createRouter() {
    const router = express.Router();
    /**
     * 获取验证码
     */
    router.get(
        '/captcha',
        getReqLimiter(10, 1000 * 3),
        packageRequestHandler(async function (req: any, res: any) {
            const captcha = captchaCreate();
            res.json(new publicReturn(200, '成功', captcha));
        }),
    );
    return router;
}
