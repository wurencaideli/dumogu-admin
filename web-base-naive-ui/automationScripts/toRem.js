/**
 * 将相应文件中的px转成rem，方便替换
 * 手动替换麻烦的很
 */
const { glob } = require('glob');
const path = require('path');
const fs = require('fs');

/**
 * 遍历需要替换的文件
 */
glob('src/views/bigScreen/show_2/**/*.vue', {
    // glob('src/views/rem/**/*.vue', {
    ignore: ['node_modules/**', 'dist/**', 'biuld.js', '.git/**'],
    dot: true,
})
    .then((files) => {
        console.log('需要替换的文件数目： ' + files.length);
        console.log('替换开始');
        files.forEach((item) => {
            // 定义一个替换函数
            function replacePxWithRem(match, p1) {
                // 将捕获的数字 p1 转换为 rem，并保留三位小数
                var remValue = ((1 / 16) * parseInt(p1)).toFixed(3);
                // 返回替换后的字符串
                return remValue + 'rem';
            }
            const path_ = path.join(__dirname, '../', item);
            let content = fs.readFileSync(path_, 'utf8');
            content = content.replace(/\b(\d+)px\b/g, replacePxWithRem);
            fs.writeFileSync(path_, content, 'utf8');
            console.log('替换成功：' + item);
        });
        console.log('替换结束');
    })
    .catch((e) => {
        console.log(e);
    });
