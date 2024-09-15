/** 引入帧动画函数（防止部分浏览器不支持） */
import '@/common/requestAnimationFrameExpand';
/** 引入 rem计算 */
import '@/common/rem';
import { isProd } from '@/common/otherTools';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
/** 添加公共样式 */
import '@/style/index.scss';
import App from './App.vue';
import router from './router/index';
/** 注册路由许可验证 */
import './permission';
/** 打印完整路由表 */
import { sysMeluConfigList } from './router/common';
import 'element-plus/theme-chalk/dark/css-vars.css';
const pinia = createPinia();
if (!isProd()) {
    console.log('系统完整路由表，router挂载全局window.router', router, sysMeluConfigList);
    /** 挂载到全局方便操作 */
    window.router = router;
    /** 提示重复菜单 */
    sysMeluConfigList.reduce((c, i) => {
        if (!i.name) return c;
        if (c[i.name]) {
            console.log('重复菜单 name', i);
        }
        c[i.name] = true;
        return c;
    }, {});
}
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
