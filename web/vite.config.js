import { defineConfig,loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import optionConfig from './oss.config';
import vitePluginAliOss from 'vite-plugin-ali-oss';
import dumoguConfig from './dumogu.config';
import { createHtmlPlugin } from 'vite-plugin-html';

const pathResolve = (dir) => {
    return resolve(__dirname, '.', dir);
};
// https://vitejs.dev/config/
export default defineConfig(({
    mode,
})=>{
    const prod = process.env.NODE_ENV === 'production';
    let base = dumoguConfig.biuldBasePath;
    let plugins = [
        vue(),
        /** 
         * 使用element按需引入的插件
         * https://element-plus.gitee.io/zh-CN/guide/quickstart.html#%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5
         *  */
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        /** 配置向html文件中注入数据的插件，向html文件中注入配置数据 */
        createHtmlPlugin({
            minify: true,
            inject:{
                data:{
                    ...dumoguConfig,
                },
            },
            template: '/index.html', // 指定根路径下的HTML模板文件
        }),
    ];
    /** 如果有阿里云配置则使用 */
    if(optionConfig.url){
        base = prod ? optionConfig.url+'/' : base;
        /** 上传到阿里云OSS上 */
        const options = {
            region: optionConfig.region,
            accessKeyId: optionConfig.accessKeyId,
            accessKeySecret: optionConfig.accessKeySecret,
            bucket: optionConfig.bucket,
            overwrite:true,
        };
        plugins.push(vitePluginAliOss(options));
    }
    return {
        base: base, // must be URL when build
        plugins: plugins,
        build: { 
            /** 指定输出路径 */
            outDir:'dist',
            //   关闭文件计算
            reportCompressedSize: false,
            //   关闭生成map文件 可以达到缩小打包体积
            sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
            // rollupOptions: {  //不对文件名使用 hash
            //     output: {
            //     // 重点在这里哦
            //         // entryFileNames: `assets/[name].${timestamp}.js`,
            //         // chunkFileNames: `assets/[name].${timestamp}.js`,
            //         // assetFileNames: `assets/[name].${timestamp}.[ext]`
            //         entryFileNames: `assets/[name].js`,
            //         chunkFileNames: `assets/[name].js`,
            //         assetFileNames: `assets/[name].[ext]`,
            //     },
            // },
        },  
        resolve: { 
            alias:{
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
                    rewrite: (p) => p.replace(/^\/api/, '/api')
                },
                /** 用作测试的上传接口 */
                '/upload-api': {
                    target: 'https://d6hqs7.lafyun.com:443',
                    changeOrigin: true,
                    rewrite: (p) => p.replace(/^\/upload-api/, '')
                },
            }
        },
    };
});
