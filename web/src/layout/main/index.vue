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
import {userData} from "@/store/User";
import {sysMeluList} from "@/router/Common";
import {
    deleteCurrentTag,
    refreshCurrentTag,
    deleteOtherTags,
    deleteLeftTags,
    deleteRightTags,
    getLatelyHisTag,
} from "./Common/TagListTools";

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
            userInfo:toRef(userDataStore,'userInfo'),
            tagList:toRef(userDataStore,'tagList'),
            activeSign:toRef(userDataStore,'activeSign'),
            showMenuList:toRef(userDataStore,'showMenuList'),
            hasSysMenuConfigMap:toRef(userDataStore,'hasSysMenuConfigMap'),
            tagHisList:toRef(userDataStore,'tagHisList'),
            breadcrumbList:[],  //面包屑列表
        });
        /** 根据系统目录获取用户的目录配置 */
        function getUserMenu(data){
            /** 优先使用当前的path判断获取映射 */
            let target = dataContainer.hasSysMenuConfigMap[data.path] || dataContainer.hasSysMenuConfigMap[data.name];
            return target || {};
        }
        /** 
         * 获取面包屑列表
         * 根据当前用户目录中获取树形级别
         *  */
        function getBreadcrumbList(){
            const userMenuConfig = getUserMenu(route);
            if(!userMenuConfig.path) return;
            let list = [];
            function findP(target){
                list.unshift(target);
                let targetP = dataContainer.hasSysMenuConfigMap[target.parentSign];
                if(targetP){
                    findP(targetP);
                }
            }
            findP(userMenuConfig);
            dataContainer.breadcrumbList = list;
        }
        /** 添加历史点击记录 */
        function addHisTagList(){
            let tagHisList = dataContainer.tagHisList;
            let tagList = dataContainer.tagList;
            let activeSign = dataContainer.activeSign;
            /** 如果与最近的一个重复则不添加 */
            let latelyHisTag = getLatelyHisTag();
            if(latelyHisTag && (latelyHisTag.sign == activeSign)) return;
            /** 找到当前显示的tag，并且添加记录 */
            let activeTag = tagList.find(item=>item.sign==activeSign);
            if(!activeTag) return;
            /** 添加到数据管理 */
            tagHisList.push(activeTag);
            userDataStore.setTagHisList(tagHisList);
        }
        /**
         * 根据当前路由情况 添加标签
         */
        function addTag(){
            let tagList = dataContainer.tagList;
            let activeSign = dataContainer.activeSign;
            /** 获取该路由对应的用户配置 */
            const userMenuConfig = getUserMenu(route);
            /** 
             * 创建一个新标签，配置其属性
             * 其中sign是唯一标识，很重要，必填 
             * menuName 必填
             * */
            let newTag = {
                title:userMenuConfig.title,
                menuName:userMenuConfig.name,
                path:route.path,
                fullPath:route.fullPath,
                sign:route.path,  //唯一标识
                isCache:userMenuConfig.isCache,  //表示该标签需要缓存
                fixed:userMenuConfig.fixed,  //表示该标签需要固定
            };
            /** 
             * 必须是系统目录中的，不然不允许添加标签，因为只有属于目录才会有标签
             *  */
            if(!sysMeluList.find(item=>item.name == route.name)) return;
            /** 
             * 不重复添加
             *  */
            if(!tagList.find(item=>item.path == newTag.sign)){
                // 添加进入标签列表，添加到当前标签的右边
                let index = tagList.findIndex(item=>{
                    return item.sign == activeSign;
                });
                if(index != -1){
                    tagList.splice(index+1,0,newTag);
                }else{
                    tagList.push(newTag);
                }
            }
            /** 设置当前所显示的标签 */
            activeSign = newTag.sign;
            userDataStore.setTagList(tagList);
            userDataStore.setActiveSign(activeSign);
            /** 添加历史记录 */
            addHisTagList();
        }
        /** 监听路由，
         * 当路由发生变化时将符合条件的标签添加到标签列表中 
         * 获取面包屑导航列表
         * */
        watch(route,()=>{
            addTag();
            getBreadcrumbList();
        },{
            immediate:true,
        });
        /** 
         * tag 点击事件
         * 跳转到该标签的地址里，注意是完整地址
         *  */
        function handleTagClick(item){
            router.push(item.fullPath);
        }
        /** 
         * tag 删除事件
         * 删除后跳转到一个最近的标签，使用标签记录
         *  */
        function handleTagRemove(tag){
            let tagList = dataContainer.tagList;
            let activeSign = dataContainer.activeSign;
            /** 还剩最后一个标签的话不用删除 */
            if(tagList.length <= 1) return;
            let index = tagList.findIndex(item=>{
                return item.sign == tag.sign;
            });
            if(index == -1) return;
            let oldTag = tagList[index];
            tagList.splice(index,1);
            userDataStore.setTagList(tagList);
            /** 如果删除的是当前的标签页的话跳转到最近的标签 */
            if(oldTag.sign === activeSign){
                let latelyHisTag = getLatelyHisTag();
                /** 触发该标签的点击事件 */
                handleTagClick(latelyHisTag);
            }
        }
        /** 操作事件 */
        function handleOptionClick(type){
            switch(true){
                case type == 1:
                    deleteCurrentTag();
                    let latelyHisTag = getLatelyHisTag();
                    /** 触发该标签的点击事件 */
                    handleTagClick(latelyHisTag);
                    break;
                case type == 2:
                    deleteOtherTags();
                    break;
                case type == 3:
                    deleteLeftTags();
                    break;
                case type == 4:
                    deleteRightTags();
                    break;
                case type == 5:
                    refreshCurrentTag();
                    break;
            }
        }
        /** 
         * 需要缓存的页面列表
         * 根据标签列表来的，需要改的话只需要处理标签列表
         *  */
        const cacheTagList = computed(()=>{
            return userDataStore.tagList.filter(item=>{
                return item.isCache;
            }).map(item=>{
                /** 缓存组件是根据path命名来缓存的 */
                return item.path;
            });
        });
        return {
            formatComponentInstance,
            dataContainer,
            handleTagClick,
            handleTagRemove,
            cacheTagList,
            handleOptionClick,
            userDataStore,
        };
    },
});
</script>

<template>
    <div class="main-layout">    
        <div class="head-container">
            <Navbar
                :userInfo="dataContainer.userInfo"
                :breadcrumbList="dataContainer.breadcrumbList"></Navbar>
        </div>
        <div class="content-container">
            <div class="left">
                <Menu
                    :dataList="dataContainer.showMenuList"></Menu>
            </div>
            <div class="right">
                <div class="top">
                    <TagList
                        :tagList="dataContainer.tagList"
                        :activeSign="dataContainer.activeSign"
                        @onChange="e=>{
                            userDataStore.setTagList(e);
                        }"
                        @onClick="handleTagClick"
                        @onRemove="handleTagRemove"
                        @onOptionClick="handleOptionClick"></TagList>
                </div>
                <div class="view-container">
                    <router-view v-slot="{ Component,route }">
                        <transition name="el-fade-in">
                            <keep-alive 
                                :include="cacheTagList">
                                <component 
                                    :is="formatComponentInstance(Component,route)"/>
                            </keep-alive>
                        </transition>
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
    position: relative;
    z-index: 9;
    >.head-container{
        width: 100%;
        background-color: white;
        height: var(--navbar-height);
        // border-bottom: 1px solid rgb(218, 218, 218);
        box-sizing: border-box;
        position: relative;
        z-index: 9;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.177);
    }
    >.content-container{
        flex: 1 1 0;
        height: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        position: relative;
        z-index: 8;
        >.left{
            width: var(--menu-width);
            height: 100%;
            overflow-y: auto;
            // border-right: 1px solid rgb(218, 218, 218);
            box-sizing: border-box;
            position: relative;
            z-index: 9;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.177);
            background-color: #153451;
        }
        >.right{
            flex: 1 1 0;
            width: 0;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 8;
            overflow: hidden;
            >.top{
                height: var(--tags-height);
                width: 100%;
                // border-bottom: 1px solid rgb(218, 218, 218);
                box-sizing: border-box;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.177);
                position: relative;
                z-index: 2;
            }
            >.view-container{
                flex: 1 1 0;
                height: 0;
                width: 100%;
                overflow: hidden;
                position: relative;
                z-index: 1;
                background-color: #f1f1f1;
            }
        }
    }
}
</style>
