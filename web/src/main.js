/** 引入帧动画函数（防止部分浏览器不支持） */
import "@/common/RequestAnimationFrameExpand";
/** 引入 rem计算 */
import "@/common/Rem";
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router/index';
/** 注册路由许可验证 */
import "./permission";
/** 打印完整路由表 */
import {sysMeluList} from "./router/Common";
console.log(
    "系统完整路由表，router挂载全局window.router",
    router,
    sysMeluList,
);
/** 提示重复菜单 */
sysMeluList.reduce((c,i)=>{
    if(c[i.name]){
        console.log('重复菜单 name',i);
    }
    c[i.name] = true;
    return c;
},{});
/** 挂载到全局方便操作 */
window.router = router;

/** 添加公共样式 */
import "@/style/index.scss";

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
