<script>
/** 
 * 操作 layout
 * 负责相应事件的统一分发处理
 */
import { ref, defineComponent,h } from 'vue';
import Navbar from "./components/Navbar.vue";
import Menu from "./components/Menu.vue";
import TagList from "./components/TagList.vue";

export default defineComponent({
    name:'MainLayout',
    components: {
        Menu,
        Navbar,
        TagList,
    },
    props: {},
    setup() {
        /** 
         * 原本方法根据组件名来缓存，现在根据路由path动态修改组件实例名称来缓存
         * 添加tag时也根据路由path来命名
         * 该实例其实也是组件对象（并没有解决问题）
         * 解决方法文章 https://blog.csdn.net/qq_42611074/article/details/127206469
         */
        const wrapperMap = new Map();
        function formatComponentInstance(component,route){
            let wrapper;
            // 重点就是这里，这个组件的名字是完全可控的，
            // 只要自己写好逻辑，每次能找到对应的外壳组件就行，完全可以写成任何自己想要的名字
            // 这就能配合 keep-alive 的 include 属性可控地操作缓存
            if (component) {
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
                return h(wrapper);
            }
        }
        return {
            formatComponentInstance,
        };
    },
});
</script>

<template>
    <div class="main-layout">    
        <div class="head-container">
            <Navbar></Navbar>
        </div>
        <div class="content-container">
            <div class="left">
                <Menu></Menu>
            </div>
            <div class="right">
                <div class="top">
                    <TagList></TagList>
                </div>
                <div class="view-container">
                    <router-view v-slot="{ Component,route }">
                        <keep-alive>
                            <component 
                                :is="formatComponentInstance(Component,route)" 
                                :key="route.path" />
                        </keep-alive>
                    </router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main-layout {
    width: 100vw;
    min-height: 100vh;
    height: fit-content;
    overflow: hidden;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    background-color: white;
    >.head-container{
        width: 100%;
        background-color: white;
        height: var(--navbar-height);
        border-bottom: 1px solid rgb(218, 218, 218);
        box-sizing: border-box;
    }
    >.content-container{
        flex: 1 1 0;
        height: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        >.left{
            width: var(--menu-width);
            height: 100%;
            overflow-y: auto;
            border-right: 1px solid rgb(218, 218, 218);
            box-sizing: border-box;
        }
        >.right{
            flex: 1 1 0;
            width: 0;
            display: flex;
            flex-direction: column;
            >.top{
                height: var(--tags-height);
                width: 100%;
                border-bottom: 1px solid rgb(218, 218, 218);
                box-sizing: border-box;
            }
            >.view-container{
                flex: 1 1 0;
                height: 0;
                width: 100%;
                overflow: hidden;
            }
        }
    }
}
</style>
