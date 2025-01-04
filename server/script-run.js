/**
 * 运行服务
 */
const path = require('path');
const fsExtra = require('fs-extra');
const isPro = process.argv[process.argv.findIndex((_) => _ == '--environment') + 1] === 'production';
const runModel = process.argv[process.argv.findIndex((_) => _ == '--model') + 1];
const productionEnv = path.join(__dirname, 'dumogu.production.env');
const developmentEnv = path.join(__dirname, 'dumogu.development.env');
require('dotenv').config({
    path: isPro ? productionEnv : developmentEnv,  // 根据环境引入相应的环境文件
});
process.env.DUMOGU_RootDir = path.join(__dirname);  // 服务根目录
process.env.DUMOGU_dataRootDir = isPro ? path.join(__dirname, 'data-pro') : path.join(__dirname, 'data');  // 服务缓存数据目录
process.env.DUMOGU_webDistRootDir = path.join(__dirname, '../web-dist');  // web资源目录
const buildDir = path.join(__dirname, 'src'); //需要打包的文件夹
const outDir = path.join(__dirname, 'dist'); //打包到那个文件夹

/** 根据不同的模式启动不同的服务 */
if (runModel == 'start') {
    const serverApp = require('./dist/index.js');
    serverApp.start();
} else if (runModel == 'start-src') {
    const serverApp = require('./src/index.js');
    serverApp.start();
} else if (runModel == 'build') {
    fsExtra.removeSync(outDir);
    const buildServer = require('./build/index.js');
    buildServer.build({
        buildDir,
        outDir,
    });
} else if (runModel == 'build-start') {
    fsExtra.removeSync(outDir);
    startAndW('start');
}else if (runModel == 'build-start-src') {
    fsExtra.removeSync(outDir);
    startAndW('start-src');
}
/** 打包，监听并启动服务 */
function startAndW(model){
    const buildServer = require('./build/index.js');
    const { spawn } = require('child_process');
    let child;
    /** 运行服务 */
    function startApp() {
        if (child) {
            child.kill();
        }
        child = spawn('node', ['script-run.js','--model',model], { stdio: 'inherit' });
    }
    async function start() {
        await buildServer.build({
            buildDir,
            outDir,
        });
        startApp();
        buildServer.watchFiles({
            buildDir,
            outDir,
            /** 一次监听结束后重新启动服务 */
            onceEnd() {
                startApp();
            },
        });
    }
    start();
}

