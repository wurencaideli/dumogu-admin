import "@/common/RequestAnimationFrameExpand";
import { createApp } from 'vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
//全局进度条的配置 
NProgress.configure({ 
    easing: 'ease', // 动画方式 
    speed: 300, // 递增进度条的速度 
    showSpinner: false, // 进度环显示隐藏
    trickleSpeed: 200, // 自动递增间隔 
    minimum: 0.3, // 更改启动时使用的最小百分比 
    parent: 'body', //指定进度条的父容器 
});
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router/index';
import "./router/Permission";

// element 其他组件已使用按需引入插件
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
/** 添加公共样式 */
import "@/style/index.scss";

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
