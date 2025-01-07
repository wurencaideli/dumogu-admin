import { mkdirSync } from "fs";
import { getEnv, getEnvType, isPro } from "./env";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ResBody } from "./common/ResBody";
import { getReqlanguage } from "./i18";
import { getPublicRouter } from "./views/public";
import { getWebDistRouter } from "./views/webDist";

/** 初始化服务 */
async function start() {
    console.log('当前环境类型', getEnvType());
    try {
        // 创建数据源文件夹
        mkdirSync(getEnv().SERVER_DATA_DIR);
    } catch { }
    const app = express();
    app.use(cors());  // 允许所有来源的跨域请求
    app.use(bodyParser.json({ limit: '0.3mb' }));  // 设置请求体大小
    app.use(bodyParser.urlencoded({ limit: '0.3mb', extended: true }));
    app.use(getPublicRouter());
    app.use(getWebDistRouter());
    app.use(errorMiddle);
    let port = getEnv().PORT;
    app.listen(port, () => {
        console.log(`服务启动 http://localhost:${port}`);
    });
}
/**
 * 错误处理中间件
 * @type {import('express').ErrorRequestHandler}
 */
function errorMiddle(err, req, res, next) {
    if (!isPro()) {
        console.error(err);
    }
    let errString;
    if (typeof err === 'string') {
        errString = err;
    } else {
        try {
            errString = err.toString();
        } catch {
            errString = '未知错误';
        }
    }
    res.json(new ResBody(500, {
        msg: errString,
        lang: getReqlanguage(req),
    }));
}

start();
