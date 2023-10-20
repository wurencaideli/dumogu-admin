<script>
/** 
 * 操作 layout
 * 负责相应事件的统一分发处理
 */
import { 
    ref, defineComponent,h,
    reactive,watch,
    toRef,
    computed,
} from 'vue';
import Navbar from "./components/Navbar.vue";
import Menu from "./components/Menu.vue";
import TagList from "./components/TagList.vue";
import { useRouter,useRoute } from "vue-router";
import {userData} from "@/store/user";
import {sysMeluList} from "@/router/Common";

export default defineComponent({
    name:'MainLayout',
    components: {
        Menu,
        Navbar,
        TagList,
    },
    props: {},
    setup() {
        let userDataStore = userData();
        const router = useRouter();
        const route = useRoute();
        /**
         * 一个tag例子的属性介绍
         */
        // {
        //     path:'/main/index',
        //     title:'标签一',  //标签标题
        //     sign:'/main/index',  //唯一标识
        //     fullPath:'/main/index',  //跳转地址，完整地址
        //     isCache:true,  //该标签页面是否缓存
        //     fixed:false,  //是否固定，不可删除
        // }
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
        const dataContainer = reactive({
            tagList:toRef(userDataStore,'tagList'),
            activeSign:toRef(userDataStore,'activeSign'),
            menuList:toRef(userDataStore,'menuList'),
        });
        /** 根据系统目录获取用户的目录配置 */
        function getUserMenu(data){
            let menuList = dataContainer.menuList;
            /** 优先使用当前的path判断获取映射 */
            let target = menuList.find(item=>item.path==data.path) || {};
            /** 其次，使用name获取映射 */
            if(!target.title){
                target = menuList.find(item=>item.name==data.name) || {};
            }
            return target;
        }
        /** 监听路由，当路由发送变化时将符合条件的标签添加到标签列表中 */
        watch(route,()=>{
            let tagList = dataContainer.tagList;
            let activeSign = dataContainer.activeSign;
            /** 
             * 已经跳转的路由添加到标签上
             * 必须是系统目录中的，不然不允许添加标签，因为只有属于目录才会有标签
             * 不重复添加
             *  */
            if(
                !!sysMeluList.find(item=>item.name==route.name) 
                && !tagList.find(item=>item.path==route.path)
            ){
                tagList.push({
                    title:getUserMenu(route).title,
                    path:route.path,
                    fullPath:route.fullPath,
                    sign:route.path,
                    isCache:getUserMenu(route).isCache,  //表示该标签需要缓存
                });
            }
            /** 设置当前所显示的标签 */
            tagList.forEach(item=>{
                if(item.path !== route.path) return;
                activeSign = item.sign;
            });
            userDataStore.setTagList(tagList);
            userDataStore.setActiveSign(activeSign);
        },{
            deep:true,
            immediate:true,
        });
        /** tag 点击事件 */
        function handleTagClick(item){
            router.push(item.fullPath);
        }
        /** tag 删除事件 */
        function handleTagRemove(tag){
            let tagList = dataContainer.tagList;
            let activeSign = dataContainer.activeSign;
            let index = tagList.findIndex(item=>{
                return item.sign == tag.sign;
            });
            if(tag.sign != activeSign){
                tagList.splice(index,1);
            }else{
                if(index > 0){
                    /** 跳转到靠左边的一个标签 */
                    handleTagClick(tagList[index - 1]);
                    tagList.splice(index,1);
                }
            }
            userDataStore.setTagList(tagList);
        }
        /** 
         * 需要缓存的列表
         * 根据标签列表来的，需要改的话只需要处理标签列表
         *  */
        const cacheTagList = computed(()=>{
            return userDataStore.tagList.filter(item=>{
                return item.isCache;
            }).map(item=>{
                return item.path;
            });
        });
        return {
            formatComponentInstance,
            dataContainer,
            handleTagClick,
            handleTagRemove,
            cacheTagList,
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
                <Menu
                    :dataList="dataContainer.menuList"></Menu>
            </div>
            <div class="right">
                <div class="top">
                    <TagList
                        :tagList="dataContainer.tagList"
                        :activeSign="dataContainer.activeSign"
                        @onClick="handleTagClick"
                        @onRemove="handleTagRemove"></TagList>
                </div>
                <div class="view-container">
                    <router-view v-slot="{ Component,route }">
                        <keep-alive 
                            :include="cacheTagList">
                            <component 
                                :is="formatComponentInstance(Component,route)"/>
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
