/**
 * 运行服务
 */
const path = require('path');
const fsExtra = require('fs-extra');
const isPro =
    process.argv[process.argv.findIndex((_) => _ == '--environment') + 1] === 'production';
const runModel = process.argv[process.argv.findIndex((_) => _ == '--model') + 1];
const productionEnv = path.join(__dirname, 'dumogu.production.env');
const developmentEnv = path.join(__dirname, 'dumogu.development.env');

// 注入环境变量
Object.assign(process.env, isPro ? getEnv(productionEnv) : getEnv(developmentEnv));

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
} else if (runModel == 'build-start-src') {
    fsExtra.removeSync(outDir);
    startAndW('start-src');
}
/** 打包，监听并启动服务 */
function startAndW(model) {
    const buildServer = require('./build/index.js');
    const { spawn } = require('child_process');
    let child;
    /** 运行服务 */
    function startApp() {
        if (child) {
            child.kill();
        }
        child = spawn('node', ['script-run.js', '--model', model], { stdio: 'inherit' });
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

/**
 * 获取环境变量
 * @param {string} p
 */
function getEnv(p) {
    let processEnv = {};
    require('dotenv').config({
        path: p,
        processEnv,
    });
    // 处理环境变量中的特殊值，这里是dir
    for (let key in processEnv) {
        if (/Dir$/.test(key)) {
            processEnv[key] = path.join(path.dirname(p), processEnv[key]);
        }
    }
    return processEnv;
}
