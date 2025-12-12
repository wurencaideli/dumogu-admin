import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import ip from 'ip';
import { program } from 'commander';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isPro } from './common/other-tools.js';
import { start as timingJobStart, addJob } from './timing-job/index.js';
import { createRouter } from './views/index.js';
import { errorMiddle } from './action/api-middleware.js';
import { setGlobalVariables } from './action/setup-global-variables.js';
import { verifyOverTime as reqLimiterVerifyOverTime } from './action/req-limiter.js';
import { verifyOverTime as captchaVerifyOverTime } from './common/captcha.js';

/** 初始化服务 */
export async function start() {
    console.log(`当前环境: ${isPro() ? 'pro' : 'dev'}`);
    const port = process.env.DUMOGU_PORT;
    const ipAddress = ip.address();
    const app = express();
    app.use(cors());
    app.use(bodyParser.json({ limit: '3mb' }));
    app.use(bodyParser.urlencoded({ limit: '3mb', extended: true }));
    app.use(createRouter());
    app.use(errorMiddle);
    app.listen(port, () => {
        console.log(`服务启动: http://localhost:${port}`);
        console.log(`服务启动: http://127.0.0.1:${port}`);
        console.log(`服务启动: http://${ipAddress}:${port}`);
    });
    /** 注入定时任务 */
    addJob('time-3', async () => {
        reqLimiterVerifyOverTime();
    });
    addJob('time-3', () => {
        captchaVerifyOverTime();
    });
    timingJobStart();
}

interface Option {
    model: 'dev' | 'pro';
}
program
    .version('1.0.0')
    .description('--')
    .option('-m, --model <model>', '运行环境')
    .action((p: Option) => {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const isPro__ = p.model == 'pro';
        dotenv.config({
            path: isPro__
                ? path.join(__dirname, '../.env.production')
                : path.join(__dirname, '../.env.development'),
            quiet: true,
        });
        setGlobalVariables('serverRootDirPath', path.join(__dirname, '../'));
        start();
    })
    .parse(process.argv);
