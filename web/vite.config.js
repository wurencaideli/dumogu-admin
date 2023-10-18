import { defineConfig,loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';

const pathResolve = (dir) => {
    return resolve(__dirname, '.', dir);
};
// https://vitejs.dev/config/
export default defineConfig(({
    mode,
})=>{
    let plugins = [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ];
    return {
        base: '/', // must be URL when build
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
                }
            }
        },
    };
});
