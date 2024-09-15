<script>
/**
 * keep-alive保存router-view
 */
import { defineComponent, h, toRef } from 'vue';

export default defineComponent({
    name: 'KeepAliveRouter',
    props: {
        cacheList: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    setup(props) {
        /**
         * 需要缓存的页面列表
         * 根据标签列表来的，需要改的话只需要处理标签列表
         *  */
        const cacheList = toRef(props, 'cacheList');
        /**
         * 原本方法根据组件名来缓存，现在根据路由path动态修改组件实例名称来缓存
         * 添加tag时也根据路由path来命名
         * 该实例其实也是组件对象（并没有解决问题）
         * 解决方法文章 https://blog.csdn.net/qq_42611074/article/details/127206469
         */
        const wrapperMap = new Map();
        function formatComponentInstance(component, route) {
            let wrapper;
            // 重点就是这里，这个组件的名字是完全可控的，
            // 只要自己写好逻辑，每次能找到对应的外壳组件就行，完全可以写成任何自己想要的名字
            // 这就能配合 keep-alive 的 include 属性可控地操作缓存
            if (!component) return;
            /** 根据路由的path来为组件命名 */
            const wrapperName = route.path;
            if (wrapperMap.has(wrapperName)) {
                wrapper = wrapperMap.get(wrapperName);
            } else {
                wrapper = {
                    name: wrapperName,
                    render() {
                        return h(component);
                    },
                };
                wrapperMap.set(wrapperName, wrapper);
            }
            /** 以标签页为主，清除不需要的，减少内存 */
            let pathList = cacheList.value || [];
            wrapperMap.forEach((_, key) => {
                if (pathList.includes(key)) return;
                if (key == wrapperName) return; //当前新加的不处理
                wrapperMap.delete(key);
            });
            return h(wrapper);
        }
        return {
            formatComponentInstance,
            cacheList,
        };
    },
});
</script>

<template>
    <router-view v-slot="{ Component, route }">
        <!-- <transition name="el-fade-in"> -->
        <keep-alive :include="cacheList">
            <component :is="formatComponentInstance(Component, route)" />
        </keep-alive>
        <!-- </transition> -->
    </router-view>
</template>
