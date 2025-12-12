import { minify } from 'terser';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import recursive from 'recursive-readdir';
import path from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const terserOptions = {
    // 压缩配置：精细化控制压缩行为
    compress: {
        drop_console: false, // 不删除 console 语句（如需删除设为 true）
        drop_debugger: true, // 删除 debugger 语句
        dead_code: true, // 移除死代码
    },
    // 混淆配置：避免破坏模块相关标识符
    mangle: {
        reserved: [
            'import',
            'export',
            'import.meta', // ESM 核心
            'require',
            'exports',
            'module', // CommonJS 核心
        ],
        properties: false, // 不混淆对象属性（避免破坏 `export const obj = { key: 1 }`）
        toplevel: false, // 不混淆顶层作用域的变量（ESM 模块顶层变量建议保留，默认 false）
    },
};
/** 压缩js */
async function compressJs() {
    const files = await recursive(path.join(__dirname, '../dist'));
    const taskList = [];
    files.forEach((filePath) => {
        if (!filePath.includes('.js')) return;
        async function a() {
            let content = fs.readFileSync(filePath, { encoding: 'utf8' });
            const output = await minify(content, terserOptions);
            content = output.code;
            fs.writeFileSync(filePath, content, { encoding: 'utf8' });
        }
        taskList.push(a());
    });
    await Promise.all(taskList);
    console.log('dist/**.js 文件已压缩');
}
compressJs();
