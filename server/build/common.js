/**
 * 项目打包操作
 */
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
const Postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');
const htmlparser2 = require('htmlparser2');
const sass = require('sass');
const cssSelect = require('css-select');
const domSerializer = require('dom-serializer');
const htmlMinifier = require('html-minifier');

/** 设置插件 */
const processor = Postcss([
    postcssPresetEnv({
        stage: 2,
        browsers: ['> 0%', 'Android 2.3', 'iOS 3.2', 'Safari 3.1', 'IE 10'], //支持大多数浏览器
    }),
]);
/** 压缩css */
function compressCss(content) {
    const output = new CleanCSS({}).minify(content);
    return output.styles;
}
/** 美化css */
async function beautifyCss(content) {
    return processor.process(content, { from: undefined }).then((result) => {
        return result.css || content;
    });
}
/** 编译sass */
function compileScss(content) {
    // 使用 sass.compileString 方法编译 SCSS 字符串
    const result = sass.compileString(content, {});
    return result.css.toString();
}
/** 压缩js */
function compressJs(content) {
    const output = UglifyJS.minify(content, {
        mangle: {
            toplevel: true,
        },
        nameCache: {},
    });
    return output.code;
}
/** 压缩html */
async function compressHtml(content) {
    // 解析 HTML 字符串为 DOM
    const dom = htmlparser2.parseDocument(content);
    // 选择所有的 style 节点并且压缩
    const styleNodes = cssSelect.selectAll('style', dom);
    for (let i = 0; i < styleNodes.length; i++) {
        const styleNode = styleNodes[i];
        if (styleNode.children.length == 0) continue;
        let cssContent = styleNode.children[0].data;
        if (styleNode.attribs.lang == 'scss') {
            cssContent = compileScss(cssContent);
        }
        cssContent = await beautifyCss(cssContent);
        cssContent = compressCss(cssContent);
        styleNode.children[0].data = cssContent;
    }
    // 选择所有的 script 节点并且压缩
    const scriptNodes = cssSelect.selectAll('script', dom);
    scriptNodes.forEach((styleNode) => {
        if (styleNode.children.length == 0) return;
        let jsContent = styleNode.children[0].data;
        jsContent = compressJs(jsContent);
        styleNode.children[0].data = jsContent;
    });
    // 将更新后的 DOM 序列化回 HTML 字符串
    let compressedHTML = domSerializer.render(dom, {
        encodeEntities: false,
    });
    compressedHTML = htmlMinifier.minify(compressedHTML, {
        collapseWhitespace: true, // 删除html里的空格 达到html的压缩
        removeComments: true, //删除html中的注释
        removeCommentsFromCDATA: true, //从脚本和样式删除的注释
        minifyURLs: true,
        minifyJS: (test) => {
            return test;
        },
        minifyCSS: false, //模板引擎的内联样式可能丢失
    });
    return compressedHTML;
}

module.exports = {
    compressCss,
    beautifyCss,
    compressJs,
    compileScss,
    compressHtml,
};
