const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ip = require('ip');
const fileTools = require('./common/fileTools');
const otherTools = require('./common/otherTools');
const resourcesTools = require('./common/resourcesTools');
const timingJob = require('./timingJob/index');
const { publicReturn } = require('./common/publicReturn');
const {getReqlanguage} = require('./i18/index');
const captchaTools = require('./common/captcha');
const viewRouter = require('./views/index');

/** 初始化服务 */
async function start() {
    console.log('当前环境: ', otherTools.isPro() ? 'pro' : 'dev');
    await fileTools.ensureDir(resourcesTools.getServerDataRootDir());  // 创建数据源文件夹
    const app = express();
    app.use(cors());  // 允许所有来源的跨域请求
    app.use(bodyParser.json({ limit: '0.3mb' }));  // 设置请求体大小
    app.use(bodyParser.urlencoded({ limit: '0.3mb', extended: true }));
    app.use(viewRouter);
    app.use(errorMiddle);
    const port = process.env.DUMOGU_PORT;
    let ipAddress = ip.address();
    app.listen(port, () => {
        console.log(`服务启动 http://localhost:${port}`);
        console.log(`服务启动 http://127.0.0.1:${port}`);
        console.log(`服务启动 http://${ipAddress}:${port}`);
    });
    /** 注入待执行方法，开始定时任务 */
    timingJob.needCallFn['night-3'].push(()=>{
        /** 清除验证码的缓存 */
        captchaTools.verifyOverTime();
    });
    timingJob.start();
}
/**
 * 错误处理中间件
 * @type {import('connect').ErrorHandleFunction}
 */
function errorMiddle(err, req, res, next) {
    if (!otherTools.isPro()) {
        console.error(err);
    }
    let errString;
    if(typeof err === 'string'){
        errString = err;
    }else{
        try {
            errString = err.toString();
        } catch  {
            errString = '未知错误';
        }
    }
    res.json(new publicReturn(500, {
        msg:errString,
        lang:getReqlanguage(req),
    }));
}
/** 直接执行则启动服务 */
if (require.main === module) {
    start();
}

module.exports = {
    start,
};
