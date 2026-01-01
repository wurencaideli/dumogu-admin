import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'element-plus/theme-chalk/dark/css-vars.css';

import '@/common/request-animation-frame-expand.js';
import '@/common/rem.js';
import '@/style/index.scss';
import App from './App.vue';
import router from './router/index.js';
import './permission.js';
import { sysMeluConfigList } from './router/common.js';
import { isProduction } from './env.js';

const pinia = createPinia();
if (!isProduction()) {
    console.log('系统完整路由表 router挂载全局window.router', router, sysMeluConfigList);
    window.router = router;
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
