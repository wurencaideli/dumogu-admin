/**
 * 项目打包操作
 * 复制除了js的文件
 * js文件进行压缩
 */
const fs = require('fs');
const fsExtra = require('fs-extra');
const recursive = require('recursive-readdir');
const chalk = require('chalk');
const mime = require('mime');
const commonTools = require('./common');
const chokidar = require('chokidar');

/** js 打包器 */
async function jsLoader({ buildFilePath, outFilePath }) {
    if (mime.getType(buildFilePath) !== 'application/javascript') return;
    let content = fs.readFileSync(buildFilePath, 'utf8');
    try {
        content = commonTools.compressJs(content) || '';
        await fsExtra.outputFile(outFilePath, content, 'utf8');
        console.log(chalk.green('js 打包完成：' + outFilePath));
    } catch {
        console.log(chalk.red('js 打包失败：' + outFilePath));
    }
}
/** css 打包器 */
async function cssLoader({ buildFilePath, outFilePath }) {
    if (mime.getType(buildFilePath) !== 'text/css') return false;
    let content = fs.readFileSync(buildFilePath, 'utf8');
    try {
        /** 先美化在压缩 */
        content = (await commonTools.beautifyCss(content)) || '';
        content = commonTools.compressCss(content);
        await fsExtra.outputFile(outFilePath, content, 'utf8');
        console.log(chalk.green('css 打包完成：' + outFilePath));
    } catch {
        console.log(chalk.red('css 打包失败：' + outFilePath));
    }
}
/** scss 打包器 */
async function scssLoader({ buildFilePath, outFilePath }) {
    if (mime.getType(buildFilePath) !== 'text/x-scss') return false;
    let content = fs.readFileSync(buildFilePath, 'utf8');
    try {
        content = commonTools.compileScss(content) || '';
        content = (await commonTools.beautifyCss(content)) || '';
        content = commonTools.compressCss(content);
        await fsExtra.outputFile(outFilePath, content, 'utf8');
        await fsExtra.copy(outFilePath, outFilePath.replace('.scss', '.css'));
        console.log(chalk.green('scss 编译完成：' + outFilePath));
        /** 将编译后的sass文件转成css文件 */
        await cssLoader({
            outFilePath: outFilePath.replace('.scss', '.css'),
            buildFilePath: outFilePath.replace('.scss', '.css'),
        });
    } catch {
        console.log(chalk.red('scss 编译失败：' + outFilePath));
    }
}
/** html 打包器 */
async function htmlLoader({ buildFilePath, outFilePath }) {
    if (mime.getType(buildFilePath) !== 'text/html') return false;
    let content = fs.readFileSync(buildFilePath, 'utf8');
    try {
        content = (await commonTools.compressHtml(content)) || '';
        await fsExtra.outputFile(outFilePath, content, 'utf8');
        console.log(chalk.green('html 打包完成：' + outFilePath));
    } catch {
        console.log(chalk.red('html 打包失败：' + outFilePath));
    }
}
/** 其他文件打包 */
function otherLoader({ buildFilePath, outFilePath }) {
    if (
        mime.getType(buildFilePath) == 'application/javascript' ||
        mime.getType(buildFilePath) == 'text/html' ||
        mime.getType(buildFilePath) == 'text/x-scss' ||
        mime.getType(buildFilePath) == 'text/css'
    )
        return false;
    return fsExtra
        .copy(buildFilePath, outFilePath)
        .then(() => {
            console.log(chalk.green('文件 创建完成：' + outFilePath));
        })
        .catch(() => {
            console.log(chalk.red('文件 创建失败：' + outFilePath));
        });
}
/** 打包文件 */
async function buildFile(buildFilePath,outFilePath){
    if(!buildFilePath || !outFilePath) return;
    /** 需要输出的文件地址 */
    await jsLoader({ buildFilePath, outFilePath });
    await cssLoader({ buildFilePath, outFilePath });
    await scssLoader({ buildFilePath, outFilePath });
    await htmlLoader({ buildFilePath, outFilePath });
    await otherLoader({ buildFilePath, outFilePath });
}
async function build({
    buildDir,
    outDir,
}) {
    if(!buildDir || !outDir) return;
    console.log(chalk.blue('打包 开始！！'));
    console.time();
    process.on('exit', () => {
        console.log(chalk.blue('打包 结束！！'));
        console.timeEnd();
    });
    let files = await recursive(buildDir);
    const allTask = [];
    /** 遍历文件，对相应文件进行处理 */
    files.forEach(async (buildFilePath) => {
        const outFilePath = buildFilePath.replace(buildDir, outDir);
        allTask.push(buildFile(buildFilePath,outFilePath));
    });
    await Promise.all(allTask);
}
/** 监听文件变化 */
function watchFiles({
    buildDir,
    outDir,
    onceEnd,
}) {
    if(!buildDir || !outDir) return;
    const dirs = [buildDir];
    const watcher = chokidar.watch(dirs, {
        ignored: [
            /.*\.(.*___jb_\w+___|gitkeep)$/,
            `**/node_modules/**`,
            `**/mock-data/**`,
            '**/dist/**',
        ],
        persistent: true,
        awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 100 },
        ignoreInitial: true // 忽略初始文件状态
    });
    let changeFiles = {}; // 发生变化的文件map
    /** 文件处理函数 */
    const handleTransform = debounceFn(async function () {
        let keys = Object.keys(changeFiles);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const fileItem = changeFiles[key];
            if(!fileItem) return;
            const buildFilePath = fileItem.path;
            const outFilePath = buildFilePath.replace(buildDir, outDir);
            if(fileItem.type == 'unlink'){
                console.log(`文件删除: ${buildFilePath}`);
                fsExtra.removeSync(outFilePath);
            }else if(fileItem.type == 'add'){
                console.log(`文件添加: ${buildFilePath}`);
                await buildFile(buildFilePath,outFilePath);
            }else{
                console.log(`文件修改: ${buildFilePath}`);
                await buildFile(buildFilePath,outFilePath);
            }
            delete changeFiles[key];
        }
        /** 一次执行完后，调用传入的回调通知外部 */
        if(onceEnd){
            onceEnd();
        }
    }, 700);
    const callback = function (path) {
        changeFiles[`${path}}`] = {
            path: path,
            type:'change',
        };
        handleTransform();
    };
    const callbackUnlink = function (path) {
        changeFiles[`${path}}`] = {
            path: path,
            type:'unlink',
        };
        handleTransform();
    };
    const callbackAdd = function (path) {
        changeFiles[`${path}}`] = {
            path: path,
            type:'add',
        };
        handleTransform();
    };
    /** 开始监听 */
    watcher
        .on('ready', () => {
            console.log(chalk.blue('监听文件变化 开始'));
        })
        .on('add', callbackAdd)
        .on('change', callback)
        .on('unlink', callbackUnlink);
}
/** 一个防抖的函数 */
function debounceFn(func, wait) {
    let timeout;
    return function (...params) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            func.call(this, ...params);
        }, wait);
    };
}

module.exports = {
    build,
    watchFiles,
};
