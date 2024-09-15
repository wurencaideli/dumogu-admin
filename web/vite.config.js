/**
 * https://vitejs.dev/config/
 * https://cn.vitejs.dev/config/#server-proxy
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vitePluginAliOss from 'vite-plugin-ali-oss';
import ossOptionConfig from './oss.config';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';

const pathResolve = (dir) => {
    return resolve(__dirname, '.', dir);
};
const ossOptions = {
    region: ossOptionConfig.region,
    accessKeyId: ossOptionConfig.accessKeyId,
    accessKeySecret: ossOptionConfig.accessKeySecret,
    bucket: ossOptionConfig.bucket,
    overwrite: true,
};
export default defineConfig(({ mode }) => {
    const isProd = mode !== 'development';
    const env = loadEnv(mode, process.cwd(), ''); // 自定义的环境变量
    let base = env.VITE_APP_biuldBase; // 打包的静态资源的burl base
    let outDir = 'dist';
    let plugins = [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        /** 配置向html文件中注入数据的插件，向html文件中注入配置数据 */
        createHtmlPlugin({
            minify: true,
            inject: {
                data: {
                    ...env,
                },
            },
            template: '/index.html', // 指定根路径下的HTML模板文件
        }),
    ];
    /** 如果使用了alioss来储存文件 */
    if (!!ossOptionConfig.url) {
        base = ossOptionConfig.url + base;
        plugins.push(vitePluginAliOss(ossOptions));
    }
    return {
        base: base, // must be URL when build
        plugins: plugins,
        build: {
            /** 指定输出路径 */
            outDir: outDir,
            reportCompressedSize: false,
            sourcemap: isProd ? false : true, // 这个生产环境一定要关闭，不然打包的产物会很大
        },
        resolve: {
            alias: {
                '@': pathResolve('./src'),
            },
        },
        server: {
            port: 8087,
            host: true,
            open: true,
            proxy: {
                // https://cn.vitejs.dev/config/#server-proxy
                '/api': {
                    // target: 'http://127.0.0.1:8089',
                    target: 'https://s.dumogu.top',
                    changeOrigin: true,
                    rewrite: (p) => p.replace(/^\/api/, '/api'),
                },
                /** 用作测试的上传接口 */
                '/upload-api': {
                    target: 'https://d6hqs7.lafyun.com:443',
                    changeOrigin: true,
                    rewrite: (p) => p.replace(/^\/upload-api/, ''),
                },
            },
        },
    };
});
